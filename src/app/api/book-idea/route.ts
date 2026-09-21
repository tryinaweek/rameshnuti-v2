import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Optional post-signup answer to "what is one thing you would love to build?"
// from the Vibe Coding OS page. Stored separately from the subscription: the
// email is already on THE LIST by the time this runs, so a failure here never
// affects the signup itself.

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

  const submission = {
    type: "book_idea",
    email,
    idea,
    source: "vibe-coding-os",
    submittedAt: new Date().toISOString(),
  };

  // Blob first, so the answer survives even if email notification fails.
  let blobSaved = false;
  try {
    await put(`book-ideas/${Date.now()}.json`, JSON.stringify(submission, null, 2), {
      access: "public",
      contentType: "application/json",
    });
    blobSaved = true;
  } catch (err) {
    console.error("book-idea blob backup failed:", err);
  }

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
          subject: `Vibe Coding OS — reader idea from ${email}`,
          text: [
            "A First Edition Circle subscriber shared what they would love to build:",
            "",
            idea,
            "",
            `From:      ${email}`,
            `Submitted: ${submission.submittedAt}`,
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
    console.error("RESEND_API_KEY not set — book idea saved to blob only");
  }

  if (!blobSaved && !emailSent) {
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
