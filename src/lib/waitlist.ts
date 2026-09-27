/**
 * Vibe Coding OS launch waitlist.
 *
 * The waitlist lives in THE LIST (public.people), not a separate table:
 * a member is any row whose source is "vibe-coding-os" or whose tags contain
 * it. That way someone already subscribed through another door (newsletter,
 * workshop) can join by being tagged, instead of bouncing off the unique
 * email constraint.
 *
 * Advance reader copies go to the first ARC_LIMIT people by join order. The
 * slot is decided once, at join time, and recorded as the "vcos-arc" tag, so
 * the ARC list is simply: tags contains vcos-arc.
 *
 * Server only: reads and tag updates use SUPABASE_SERVICE_ROLE_KEY.
 */

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

async function countWhere(filter: string): Promise<number | null> {
  const h = headers({ Prefer: "count=exact", Range: "0-0" });
  if (!h) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/people?select=id&${filter}`, {
    headers: h,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const total = res.headers.get("content-range")?.split("/")[1];
  const n = total ? Number(total) : NaN;
  return Number.isFinite(n) ? n : null;
}

/** Advance copies still unclaimed, or null when the count can't be read. */
export async function arcsRemaining(): Promise<number | null> {
  const claimed = await countWhere(`tags=cs.{${ARC_TAG}}`);
  return claimed === null ? null : Math.max(0, ARC_LIMIT - claimed);
}

interface PersonRow {
  id: string;
  source: string | null;
  tags: string[] | null;
}

async function findByEmail(email: string): Promise<PersonRow | null> {
  const h = headers();
  if (!h) return null;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/people?select=id,source,tags&email=eq.${encodeURIComponent(email)}`,
    { headers: h, cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as PersonRow[];
  return rows[0] ?? null;
}

async function setTags(id: string, tags: string[]): Promise<boolean> {
  const h = headers({ Prefer: "return=minimal" });
  if (!h) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/people?id=eq.${id}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ tags }),
  });
  return res.ok;
}

export type JoinResult =
  | { status: "joined"; position: number | null; arc: boolean }
  | { status: "already" }
  | { status: "error" };

export async function joinWaitlist(email: string): Promise<JoinResult> {
  const h = headers({ Prefer: "return=representation" });
  if (!h) return { status: "error" };

  const insert = await fetch(`${SUPABASE_URL}/rest/v1/people?select=id,source,tags`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({ email, source: WAITLIST_TAG, tags: [WAITLIST_TAG] }),
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
    if (!(await setTags(row.id, row.tags))) return { status: "error" };
  } else {
    return { status: "error" };
  }
  if (!row) return { status: "error" };

  const position = await countWhere(MEMBER_FILTER);

  let arc = false;
  const remaining = await arcsRemaining();
  if (remaining !== null && remaining > 0) {
    const tags = row.tags ?? [];
    arc = await setTags(row.id, [...tags.filter((t) => t !== ARC_TAG), ARC_TAG]);
  }

  return { status: "joined", position, arc };
}
