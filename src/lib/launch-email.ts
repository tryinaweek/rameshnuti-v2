/**
 * The one email a new Launch Circle member gets right after joining.
 *
 * The book list lives only in Supabase until launch (it is imported into
 * Substack then), so nothing else would ever write to a new member. This
 * confirms the sign-up and gives them a way off the list: the small print
 * promises "Unsubscribe anytime", and a reply to this email is how.
 *
 * Best effort and never throws: a sign-up must not fail because Resend did.
 * Server only; RESEND_API_KEY and RESEND_FROM are the same variables the
 * optional-answer notification uses.
 */

const SEND_TIMEOUT_MS = 5000;

export async function sendLaunchCircleConfirmation(email: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("launch confirmation not sent: RESEND_API_KEY is not set");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Ramesh Nuti <onboarding@resend.dev>",
        to: [email],
        reply_to: process.env.ASSESSMENT_NOTIFY_EMAIL || "ramesh@svyam.co",
        subject: "You're in the Launch Circle",
        text: [
          "You're in.",
          "",
          "Thank you for joining the Launch Circle for The Vibe Coder's OS. I'll be in touch before launch day.",
          "",
          "If you didn't sign up, or you'd like to come off the list, just reply to this email and I'll remove you.",
          "",
          "Ramesh Nuti",
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("launch confirmation resend error:", res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("launch confirmation request failed:", err);
    return false;
  }
}
