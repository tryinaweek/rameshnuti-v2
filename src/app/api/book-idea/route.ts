import { NextRequest, NextResponse } from "next/server";
import { saveBuildIdea } from "@/lib/waitlist";

// Optional post-signup answer to "What are you trying to build?" from The Vibe
// Coder's OS page. Saved on the member's own row in THE LIST (people.build_idea).
// Stored separately from the subscription: the email is already on THE LIST by
// the time this runs, so a failure here never affects the signup itself.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const idea = typeof body.idea === "string" ? body.idea.trim() : "";

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!idea || idea.length > 2000) {
    return NextResponse.json({ error: "Idea is required" }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();

  // The record first, so the answer survives even if email notification fails.
  const saved = (await saveBuildIdea(email, idea)) === "saved";
  if (!saved) console.error("book-idea: could not save to the sign-up record");

  let emailSent = false;
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Assessments <onboarding@resend.dev>",
          to: [process.env.ASSESSMENT_NOTIFY_EMAIL || "ramesh@svyam.co"],
          reply_to: email,
          subject: `The Vibe Coder's OS: reader idea from ${email}`,
          text: [
            "A Launch Circle member shared what they are trying to build:",
            "",
            idea,
            "",
            `From:      ${email}`,
            `Submitted: ${submittedAt}`,
          ].join("\n"),
        }),
      });
      emailSent = res.ok;
      if (!res.ok) {
        console.error("book-idea resend error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("book-idea resend request failed:", err);
    }
  } else {
    console.error("RESEND_API_KEY not set, no notification email sent");
  }

  if (!saved && !emailSent) {
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
