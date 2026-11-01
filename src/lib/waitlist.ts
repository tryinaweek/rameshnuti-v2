/**
 * Vibe Coding OS launch waitlist.
 *
 * The waitlist lives in THE LIST (public.people), not a separate table:
 * a member is any row whose source is "vibe-coding-os" or whose tags contain
 * it. That way someone already subscribed through another door (newsletter,
 * workshop) can join by being tagged, instead of bouncing off the unique
 * email constraint.
 *
 * Advance reader copies go to the first ARC_LIMIT people by join order, which
 * the book page no longer promises. The decision at join time comes from the
 * member count, not from counting tags:
 * people who joined before the advance-copy feature existed are members
 * without the tag, and counting tags would skip them. The "vcos-arc" tag is
 * still written at join time as the send list (docs/waitlist-arc-backfill.sql
 * tags the early members).
 *
 * Server only: reads and tag updates use SUPABASE_SERVICE_ROLE_KEY.
 */

import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/attribution";

// Overridable so the capture paths can be exercised against a local stand-in.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://nbfkibomkxvqyaoakmma.supabase.co";

export const WAITLIST_TAG = "vibe-coding-os";
export const ARC_TAG = "vcos-arc";
export const ARC_LIMIT = 50;

const MEMBER_FILTER = `or=(source.eq.${WAITLIST_TAG},tags.cs.{${WAITLIST_TAG}})`;

function headers(extra: Record<string, string> = {}): Record<string, string> | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

/**
 * Counts rows matching `filter`. Uncached by default, because join-time
 * decisions need the exact current number; pass `cacheSeconds` for a display
 * count that can be a little stale.
 */
async function countWhere(filter: string, cacheSeconds?: number): Promise<number | null> {
  const h = headers({ Prefer: "count=exact", Range: "0-0" });
  if (!h) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/people?select=id&${filter}`, {
    headers: h,
    ...(cacheSeconds ? { next: { revalidate: cacheSeconds } } : { cache: "no-store" as const }),
  });
  if (!res.ok) return null;
  const total = res.headers.get("content-range")?.split("/")[1];
  const n = total ? Number(total) : NaN;
  return Number.isFinite(n) ? n : null;
}

/** The book page shows its join count only from this many members up. */
export const JOIN_COUNT_MIN = 25;

/** Waitlist members so far, or null when the count can't be read. */
export async function waitlistCount(): Promise<number | null> {
  return countWhere(MEMBER_FILTER, 60);
}

interface PersonRow {
  id: string;
  source: string | null;
  tags: string[] | null;
  [key: string]: unknown;
}

async function findByEmail(email: string): Promise<PersonRow | null> {
  const h = headers();
  if (!h) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/people?select=id,source,tags,${ATTRIBUTION_KEYS.join(",")}&email=eq.${encodeURIComponent(email)}`,
    { headers: h, cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as PersonRow[];
  return rows[0] ?? null;
}

async function patchPerson(id: string, fields: Record<string, unknown>): Promise<boolean> {
  const h = headers({ Prefer: "return=minimal" });
  if (!h) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/people?id=eq.${id}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify(fields),
  });
  return res.ok;
}

const setTags = (id: string, tags: string[]) => patchPerson(id, { tags });

export type JoinResult =
  | { status: "joined"; position: number | null; arc: boolean }
  | { status: "already" }
  | { status: "error" };

/**
 * `attribution` is how the visitor first arrived (lib/attribution). A new row
 * stores it; an existing row only gets it when nothing was recorded before,
 * so an earlier first visit is never overwritten.
 */
export async function joinWaitlist(
  email: string,
  attribution: Attribution = {}
): Promise<JoinResult> {
  const h = headers({ Prefer: "return=representation" });
  if (!h) return { status: "error" };

  const insert = await fetch(`${SUPABASE_URL}/rest/v1/people?select=id,source,tags`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ email, source: WAITLIST_TAG, tags: [WAITLIST_TAG], ...attribution }),
  });

  let row: PersonRow | null = null;
  if (insert.ok) {
    row = ((await insert.json()) as PersonRow[])[0] ?? null;
  } else if (insert.status === 409) {
    // Already on THE LIST through another door. Tag them into the waitlist
    // unless they're already in it.
    row = await findByEmail(email);
    if (!row) return { status: "error" };
    const tags = row.tags ?? [];
    if (row.source === WAITLIST_TAG || tags.includes(WAITLIST_TAG)) {
      return { status: "already" };
    }
    row.tags = [...tags, WAITLIST_TAG];
    const knownBefore = ATTRIBUTION_KEYS.some((k) => row?.[k] != null);
    const fields = knownBefore ? { tags: row.tags } : { tags: row.tags, ...attribution };
    if (!(await patchPerson(row.id, fields))) return { status: "error" };
  } else {
    return { status: "error" };
  }
  if (!row) return { status: "error" };

  const position = await countWhere(MEMBER_FILTER);

  // Your place in line decides the advance copy, nothing else.
  let arc = false;
  if (position !== null && position <= ARC_LIMIT) {
    const tags = row.tags ?? [];
    arc = await setTags(row.id, [...tags.filter((t) => t !== ARC_TAG), ARC_TAG]);
  }

  return { status: "joined", position, arc };
}

/**
 * Save the optional "What are you trying to build?" answer on the member's own
 * row (people.build_idea; see docs/book-idea-column.sql). Only waitlist members
 * are touched, so the endpoint can't be used to write onto an unrelated row.
 * Returns "saved", "not-member" when no waitlist row matches the address, or
 * "error" (including when the column hasn't been added yet).
 */
export async function saveBuildIdea(
  email: string,
  idea: string
): Promise<"saved" | "not-member" | "error"> {
  const h = headers({ Prefer: "return=representation" });
  if (!h) return "error";
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/people?select=id&email=eq.${encodeURIComponent(email)}&${MEMBER_FILTER}`,
    {
      method: "PATCH",
      headers: h,
      body: JSON.stringify({ build_idea: idea }),
    }
  );
  if (!res.ok) return "error";
  const rows = (await res.json()) as { id: string }[];
  return rows.length > 0 ? "saved" : "not-member";
}
