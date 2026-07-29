import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const challenge = typeof body.challenge === "string" ? body.challenge.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (company.length > 300 || challenge.length > 4000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const submission = {
    type: "assessment_request",
    name,
    email,
    company,
    challenge,
    submittedAt: new Date().toISOString(),
    referrer: req.headers.get("referer") ?? "",
  };

  // Backup to Blob first so the lead survives even if email delivery fails.
  let blobSaved = false;
  try {
    await put(
      `assessment-leads/${Date.now()}.json`,
      JSON.stringify(submission, null, 2),
      { access: "public", contentType: "application/json" }
    );
    blobSaved = true;
  } catch (err) {
    console.error("Blob backup failed:", err);
  }

  // Notify Ramesh via Resend.
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
          subject: `New assessment request — ${name}${company ? ` (${company})` : ""}`,
          text: [
            "New free AI workflow assessment request from rameshnuti.com",
            "",
            `Name:    ${name}`,
            `Email:   ${email}`,
            `Company: ${company || "—"}`,
            "",
            "Most time-consuming workflow:",
            challenge || "—",
            "",
            `Submitted: ${submission.submittedAt}`,
          ].join("\n"),
        }),
      });
      emailSent = res.ok;
      if (!res.ok) {
        console.error("Resend error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Resend request failed:", err);
    }
  } else {
    console.error("RESEND_API_KEY not set — submission saved to blob only");
  }

  if (!blobSaved && !emailSent) {
    return NextResponse.json(
      { error: "Could not submit right now. Please email ramesh@svyam.co directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
