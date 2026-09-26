/**
 * Substack is the one canonical mailing list. Everything that captures an
 * address on this site ends up there, through this module.
 *
 * WHICH SUBSCRIPTION METHOD, AND WHY
 *
 * Substack has no supported API for adding a subscriber. Its 2026 Developer
 * API only looks up creator profiles. The supported ways to get an address
 * onto a publication are (1) the official signup embed, (2) the /subscribe
 * page, and (3) a CSV import from the publisher dashboard. None of those is
 * something a server can call.
 *
 * So this site uses all three, in layers:
 *
 *   Client side  — the official embed (SubstackEmbed.tsx), and NewsletterForm
 *                  opening the /subscribe page with the address prefilled. Both
 *                  fully supported; Substack owns confirmation and opt-in.
 *
 *   Server side  — subscribeToSubstack() below posts to
 *                  {publication}/api/v1/free, which is the request the
 *                  official embed makes when its button is pressed. It is not
 *                  documented, but it needs no credentials, has carried every
 *                  embed signup for years, and is idempotent for an address
 *                  that is already subscribed. It is treated as best effort:
 *                  any failure is logged and recorded, never surfaced.
 *
 *   Safety net   — every attempt is audited on THE LIST (substack_synced /
 *                  substack_synced_at). /api/admin/substack-export turns the
 *                  unsynced rows into the exact CSV Substack's dashboard
 *                  import accepts, so if the undocumented request ever stops
 *                  working, nothing is lost and the fallback is supported.
 *
 * Double opt-in: Substack decides. We never send an email of any kind, and
 * whatever confirmation flow the publication has enabled runs as it would for
 * an embed signup. Nothing here can make an address "confirmed" on its own.
 *
 * No secrets reach the browser: this module is imported only by route
 * handlers, and the only key it uses is SUPABASE_SERVICE_ROLE_KEY, for the
 * audit columns.
 */

export const SUBSTACK_PUBLICATION_URL =
  process.env.SUBSTACK_PUBLICATION_URL ?? "https://startupvalue.substack.com";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://nbfkibomkxvqyaoakmma.supabase.co";
const SITE_URL = "https://rameshnuti.com";

/** How long to wait on Substack before giving up. Signups must not hang on it. */
const SUBSTACK_TIMEOUT_MS = 8000;

export type SubstackResult =
  | { ok: true; already: boolean }
  | { ok: false; reason: string };

export interface SubscribeInput {
  email: string;
  name?: string;
  /** Where on the site this came from, e.g. "website:book-waitlist", "ghl:workshop-download". */
  source: string;
}

/** A source label becomes a path Substack records as the signup's first URL. */
function attributionUrl(source: string): string {
  const slug = source.replace(/[^a-z0-9:_-]/gi, "-").toLowerCase();
  return `${SITE_URL}/?ref=${encodeURIComponent(slug)}`;
}

/**
 * Subscribes one address to the publication as a free subscriber.
 *
 * Never throws. A network error, a timeout, a captcha challenge, or a 5xx all
 * come back as { ok: false } with a reason for the log, so that no capture
 * path on the site can fail because Substack did.
 */
export async function subscribeToSubstack(input: SubscribeInput): Promise<SubstackResult> {
  const email = input.email.trim().toLowerCase();
  const url = `${SUBSTACK_PUBLICATION_URL}/api/v1/free?nojs=true`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBSTACK_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: SITE_URL,
        "User-Agent": "rameshnuti.com subscribe bridge (+https://rameshnuti.com)",
      },
      // The same shape the official embed submits. `source` is Substack's own
      // attribution enum; ours rides along in first_url so it shows up in the
      // subscriber's record on the dashboard.
      body: JSON.stringify({
        email,
        first_url: attributionUrl(input.source),
        first_referrer: SITE_URL,
        current_url: attributionUrl(input.source),
        current_referrer: SITE_URL,
        referral_code: "",
        source: "embed",
      }),
    });

    // The nojs form path answers with a redirect on success; the JSON path
    // answers 200. Both mean Substack accepted the address.
    if (res.ok || res.status === 302 || res.status === 303) {
      return { ok: true, already: false };
    }

    const text = await res.text().catch(() => "");
    // Re-subscribing an existing address must never look like an error.
    if (/already/i.test(text)) return { ok: true, already: true };

    return { ok: false, reason: `substack ${res.status}${text ? `: ${text.slice(0, 120)}` : ""}` };
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError" ? "substack timeout" : `substack ${String(err)}`;
    return { ok: false, reason };
  } finally {
    clearTimeout(timer);
  }
}

function serviceHeaders(): Record<string, string> | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

/**
 * Stamps the audit columns on THE LIST for one address.
 *
 * Returns false, without throwing, when the service key isn't configured or
 * the row isn't there. The audit trail is nice to have; the signup is not.
 */
export async function markSubstackSynced(email: string): Promise<boolean> {
  const headers = serviceHeaders();
  if (!headers) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/people?email=eq.${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ substack_synced: true, substack_synced_at: new Date().toISOString() }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export interface SyncOutcome {
  substack: SubstackResult;
  /** True when the audit columns were written. */
  audited: boolean;
}

/**
 * The one call every capture path makes after it has stored the address:
 * hand it to Substack, and if that worked, record that it did.
 */
export async function syncToSubstack(input: SubscribeInput): Promise<SyncOutcome> {
  const substack = await subscribeToSubstack(input);
  if (!substack.ok) {
    console.warn(`substack sync failed [${input.source}]: ${substack.reason}`);
    return { substack, audited: false };
  }
  const audited = await markSubstackSynced(input.email);
  return { substack, audited };
}
