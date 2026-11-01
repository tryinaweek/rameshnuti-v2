import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/attribution";

/**
 * Saves how someone first arrived (lib/attribution) on an existing people row,
 * only when nothing was recorded for them before. One conditional PATCH: the
 * filter matches the row only while every arrival column is empty, so an
 * earlier first visit is never overwritten.
 *
 * Server only (service role key). Best effort and never throws: a signup must
 * not fail or slow down because of this.
 */

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://nbfkibomkxvqyaoakmma.supabase.co";
const EMPTY_FILTER = ATTRIBUTION_KEYS.map((k) => `${k}=is.null`).join("&");

export async function recordArrivalIfMissing(email: string, attribution: Attribution): Promise<void> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || Object.keys(attribution).length === 0) return;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/people?email=eq.${encodeURIComponent(email)}&${EMPTY_FILTER}`, {
      method: "PATCH",
      signal: AbortSignal.timeout(3000),
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(attribution),
    });
  } catch (err) {
    console.error("arrival not recorded:", err);
  }
}
