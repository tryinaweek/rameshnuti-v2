/**
 * The newsletter, described once.
 *
 * Every signup form, every mention of the newsletter, and every link to it
 * reads from here, so the site can never again promise five different
 * newsletters. The promise is Ramesh's own wording from the restart email.
 *
 * Imports nothing, so client components can use it.
 */
export const NEWSLETTER = {
  name: "Ship This Week",
  url: "https://startupvalue.substack.com",
  cadence: "Every Saturday",
  promise: "One AI playbook for founders who don't code. One system, one thing you can use that day.",
  /** The full sentence, exactly as it went out in the restart email. */
  line: "Every Saturday: one AI playbook for founders who don't code. One system, one thing you can use that day.",
  /** Shown on every workshop download gate, so no gate subscribes anyone silently. */
  gateNote: "You'll also get the Saturday playbook on Substack. Free, and you can unsubscribe anytime.",
  gateButton: "Unlock files & subscribe",
} as const;

/** Substack's own signup page, with the address prefilled when we have it. */
export function substackSubscribeUrl(email?: string): string {
  const base = `${NEWSLETTER.url}/subscribe`;
  return email ? `${base}?email=${encodeURIComponent(email)}` : base;
}
