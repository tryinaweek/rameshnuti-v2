/**
 * How a visitor first arrived at the site: campaign tags on the link they
 * followed, the site that linked them here, and the page they landed on.
 *
 * Recorded in the visitor's own browser on their first visit (FirstTouch in
 * the root layout), and only sent to us if they sign up. First visit, not the
 * signup page, because people often land on the homepage and click through,
 * and by then the referring site would just be this one.
 */

export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
  "landing_page",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const STORAGE_KEY = "rn_first_touch";
const MAX_LEN = 300;

const hasUtm = (a: Attribution) => Boolean(a.utm_source || a.utm_medium || a.utm_campaign);
const bareHost = (host: string) => host.replace(/^www\./, "").toLowerCase();

/** Browser only. Keeps the first visit, unless a later one carries campaign tags and the first didn't. */
export function captureFirstTouch(): void {
  try {
    const url = new URL(window.location.href);
    const current: Attribution = { landing_page: url.pathname };
    for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
      const v = url.searchParams.get(key)?.trim();
      if (v) current[key] = v.slice(0, MAX_LEN);
    }
    if (document.referrer) {
      const host = bareHost(new URL(document.referrer).hostname);
      if (host && host !== bareHost(url.hostname)) current.referrer = host;
    }

    const stored = readFirstTouch();
    if (!stored || (hasUtm(current) && !hasUtm(stored))) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Storage blocked or a malformed referrer: attribution is optional.
  }
}

/** Browser only. What captureFirstTouch saved, if anything. */
export function readFirstTouch(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? cleanAttribution(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** Server and browser. Keeps only known keys holding short, plausible strings. */
export function cleanAttribution(input: unknown): Attribution {
  const out: Attribution = {};
  if (!input || typeof input !== "object") return out;
  const obj = input as Record<string, unknown>;
  for (const key of ATTRIBUTION_KEYS) {
    const raw = obj[key];
    if (typeof raw !== "string") continue;
    const v = raw.trim().slice(0, MAX_LEN);
    if (!v) continue;
    if (key === "landing_page" && !v.startsWith("/")) continue;
    if (key === "referrer" && !/^[a-z0-9.-]+$/i.test(v)) continue;
    out[key] = v;
  }
  return out;
}

/** One line for the admin "Came from" column: campaign tags, else the referring site. */
export function describeOrigin(row: Record<string, unknown>): string | null {
  const s = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const utm = [s(row.utm_source), s(row.utm_medium), s(row.utm_campaign)].filter(Boolean);
  if (utm.length) return utm.join(" / ");
  return s(row.referrer);
}
