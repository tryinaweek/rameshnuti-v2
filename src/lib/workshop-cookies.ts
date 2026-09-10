/**
 * Gate cookie names and email normalization, shared by the browser form, the
 * download endpoint, and the stats reader.
 *
 * This module deliberately imports nothing. `@/lib/workshops` is blob-backed,
 * and importing it from a client component would drag the Vercel Blob SDK into
 * the browser bundle.
 */

/**
 * Set at the email gate and read back by /api/download so a download can be
 * attributed to the person who unlocked it.
 *
 * Client-set, exactly like `unlocked_<slug>` — this is attribution, not access
 * control, and the download endpoint has never been gated. Treat the value as
 * untrusted input and normalize it before it reaches the database.
 */
export const EMAIL_COOKIE = 'workshop_email';

/** Both cookies expire together, so an unlocked visitor is always identified. */
export const UNLOCK_MAX_AGE_SECONDS = 86400;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Normalizes an untrusted email, returning null when it is unusable. */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) return null;
  return email;
}
