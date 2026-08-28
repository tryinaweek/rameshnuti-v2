import { SECTION_EMAIL_TAG } from '@/lib/build-types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/workshops';

/**
 * Where a Build With Me signup goes.
 *
 * 1. Supabase `build_signups` — the record with everything: first name, email,
 *    signup date, source page, build, tags, and UTMs. Insert-only under RLS
 *    with the same public anon key the rest of the site uses. A unique index on
 *    (email, build_slug) means the same person asking twice is ignored, not
 *    duplicated.
 * 2. Supabase `people` — THE LIST, so a Build With Me address lands in the same
 *    place as every other address on the brand.
 * 3. Kit (optional) — when KIT_API_KEY is set, the subscriber is created and
 *    tagged "Build With Me" plus the per-build tag.
 *
 * Steps 2 and 3 never block step 1, and no step blocks the download. See
 * docs/build-with-me.md for the table definitions.
 */

export interface SignupInput {
  firstName: string;
  email: string;
  buildSlug: string;
  buildTitle: string;
  emailTag: string;
  sourcePage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  referrer: string;
}

export interface SignupResult {
  /** False when this email already had this build's pack. */
  isNew: boolean;
  /** True when the record reached Supabase (or the table isn't set up yet). */
  stored: boolean;
}

function anonHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export function serviceHeaders(): Record<string, string> | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

/** Adds the address to THE LIST. A 409 just means it was already there. */
async function addToTheList(email: string, sourceTag: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/people`, {
      method: 'POST',
      headers: anonHeaders({ Prefer: 'resolution=ignore-duplicates' }),
      body: JSON.stringify({ email, source: sourceTag.slice(0, 64) }),
    });
  } catch {
    // THE LIST is a secondary destination — never fail a signup over it.
  }
}

/**
 * Creates the subscriber in Kit and applies both tags. Tags are looked up by
 * name and created when missing, so no tag IDs need configuring by hand.
 */
async function syncToKit(input: SignupInput): Promise<void> {
  const key = process.env.KIT_API_KEY;
  if (!key) return;
  const headers = { 'X-Kit-Api-Key': key, 'Content-Type': 'application/json' };

  try {
    await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email_address: input.email,
        first_name: input.firstName || undefined,
        fields: { build_with_me_source: input.sourcePage.slice(0, 120) },
      }),
    });

    const listRes = await fetch('https://api.kit.com/v4/tags?per_page=500', { headers });
    const existing: { id: number; name: string }[] = listRes.ok
      ? ((await listRes.json())?.tags ?? [])
      : [];

    for (const name of [SECTION_EMAIL_TAG, input.emailTag]) {
      if (!name) continue;
      let tag = existing.find((t) => t.name === name);
      if (!tag) {
        const created = await fetch('https://api.kit.com/v4/tags', {
          method: 'POST',
          headers,
          body: JSON.stringify({ name }),
        });
        if (!created.ok) continue;
        tag = (await created.json())?.tag;
      }
      if (!tag?.id) continue;
      await fetch(`https://api.kit.com/v4/tags/${tag.id}/subscribers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email_address: input.email }),
      });
    }
  } catch {
    // Provider sync is best effort — Supabase is the source of truth.
  }
}

export async function recordSignup(input: SignupInput): Promise<SignupResult> {
  const row = {
    first_name: input.firstName.slice(0, 80),
    email: input.email,
    build_slug: input.buildSlug,
    build_title: input.buildTitle.slice(0, 200),
    email_tag: input.emailTag.slice(0, 120),
    source_page: input.sourcePage.slice(0, 200),
    utm_source: input.utmSource.slice(0, 120) || null,
    utm_medium: input.utmMedium.slice(0, 120) || null,
    utm_campaign: input.utmCampaign.slice(0, 120) || null,
    referrer: input.referrer.slice(0, 300) || null,
  };

  let isNew = true;
  let stored = false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/build_signups`, {
      method: 'POST',
      headers: anonHeaders({
        // ignore-duplicates + representation: an empty array back means the
        // unique index on (email, build_slug) already had this pair.
        Prefer: 'resolution=ignore-duplicates,return=representation',
      }),
      body: JSON.stringify(row),
    });
    if (res.ok) {
      stored = true;
      const inserted = await res.json().catch(() => []);
      isNew = Array.isArray(inserted) ? inserted.length > 0 : true;
    } else if (res.status === 409) {
      stored = true;
      isNew = false;
    }
  } catch {
    // Fall through: the visitor still gets their download.
  }

  await addToTheList(input.email, `build-${input.buildSlug}`);
  if (isNew) await syncToKit(input);

  return { isNew, stored };
}

export interface SignupStats {
  /** build slug → signups */
  byBuild: Record<string, number>;
  total: number;
  /** utm_source (or "direct") → signups */
  bySource: Record<string, number>;
}

/** Admin-only. Returns null when SUPABASE_SERVICE_ROLE_KEY isn't configured. */
export async function readSignupStats(): Promise<SignupStats | null> {
  const headers = serviceHeaders();
  if (!headers) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/build_signups?select=build_slug,utm_source&limit=50000`,
      { headers, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { build_slug: string; utm_source: string | null }[];
    const byBuild: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    for (const r of rows) {
      byBuild[r.build_slug] = (byBuild[r.build_slug] ?? 0) + 1;
      const src = r.utm_source || 'direct';
      bySource[src] = (bySource[src] ?? 0) + 1;
    }
    return { byBuild, bySource, total: rows.length };
  } catch {
    return null;
  }
}

/** Fire-and-forget download log, mirroring the workshop download counter. */
export function logBuildDownload(buildSlug: string, filename: string): Promise<void> {
  return fetch(`${SUPABASE_URL}/rest/v1/build_downloads`, {
    method: 'POST',
    headers: anonHeaders(),
    body: JSON.stringify({ build_slug: buildSlug, filename }),
  })
    .then(() => undefined)
    .catch(() => undefined);
}
