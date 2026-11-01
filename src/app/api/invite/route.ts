import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

import { cleanAttribution, describeOrigin } from "@/lib/attribution";

/**
 * Workshop and speaking invitations from /work-with-me.
 *
 * Each invitation is emailed to Ramesh through Resend, with reply-to set to
 * the sender so he can answer straight from his inbox. A JSON copy is kept in
 * the Blob store first (invitations/, random suffix, never linked anywhere)
 * so an invitation survives a failed email. The request only fails when
 * neither worked.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TYPES = { workshop: "Workshop", speaking: "Speaking" } as const;
const AUDIENCES = ["Under 25", "25 to 100", "100 to 500", "500+"];
const SEND_TIMEOUT_MS = 8000;

type InviteType = keyof typeof TYPES;

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Hidden field only bots fill in. Look successful, send nothing.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const type = body.type as InviteType;
  const name = text(body.name, 200);
  const email = text(body.email, 320).toLowerCase();
  const organization = text(body.organization, 200);
  const when = text(body.when, 200);
  const location = text(body.location, 200);
  const audience = AUDIENCES.includes(text(body.audience, 20)) ? text(body.audience, 20) : "";
  const details = text(body.details, 4000);

  if (!(type in TYPES)) {
    return NextResponse.json({ error: "Choose a workshop or a talk." }, { status: 400 });
  }
  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please add a valid email address." }, { status: 400 });
  }
  if (!organization) {
    return NextResponse.json({ error: "Please add your organization." }, { status: 400 });
  }
  if (details.length < 10) {
    return NextResponse.json({ error: "Please tell me a little about the event." }, { status: 400 });
  }

  const origin = describeOrigin(cleanAttribution(body.attribution));
  const submittedAt = new Date().toISOString();
  const label = TYPES[type];
  const invitation = {
    type: label, name, email, organization, when, location, audience, details,
    cameFrom: origin, submittedAt,
  };

  let saved = false;
  try {
    await put(`invitations/${submittedAt.slice(0, 10)}-${type}.json`, JSON.stringify(invitation, null, 2), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
    saved = true;
  } catch (err) {
    console.error("invite: blob backup failed:", err);
  }

  const rows: [string, string][] = [
    ["Type", label],
    ["Name", name],
    ["Email", email],
    ["Organization", organization],
    ["When", when || "Not given"],
    ["Where", location || "Not given"],
    ["Audience", audience || "Not given"],
    ["Came from", origin || "Not captured"],
  ];

  let sent = false;
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Ramesh Nuti <onboarding@resend.dev>",
          to: [process.env.ASSESSMENT_NOTIFY_EMAIL || "ramesh@svyam.co"],
          reply_to: email,
          subject: `${label} invitation: ${organization} (${name})`,
          text: [
            `New ${label.toLowerCase()} invitation from rameshnuti.com/work-with-me`,
            "",
            ...rows.map(([k, v]) => `${(k + ":").padEnd(14)}${v}`),
            "",
            "About the event:",
            details,
            "",
            "Reply to this email to answer them directly.",
          ].join("\n"),
          html: `<div style="font-family:-apple-system,Segoe UI,sans-serif;font-size:14px;color:#1e293b;max-width:560px">
<p style="margin:0 0 16px">New <strong>${escapeHtml(label.toLowerCase())} invitation</strong> from rameshnuti.com/work-with-me</p>
<table cellpadding="6" style="border-collapse:collapse;margin-bottom:16px">${rows
            .map(
              ([k, v]) =>
                `<tr><td style="color:#64748b;padding-right:16px;vertical-align:top">${k}</td><td>${escapeHtml(v)}</td></tr>`
            )
            .join("")}</table>
<p style="margin:0 0 6px;color:#64748b">About the event</p>
<p style="margin:0 0 20px;white-space:pre-wrap">${escapeHtml(details)}</p>
<p style="margin:0;color:#94a3b8;font-size:12px">Reply to this email to answer ${escapeHtml(name)} directly.</p>
</div>`,
        }),
      });
      sent = res.ok;
      if (!res.ok) console.error("invite: resend error:", res.status, await res.text());
    } catch (err) {
      console.error("invite: resend request failed:", err);
    }
  } else {
    console.error("invite: RESEND_API_KEY not set, saved to blob only");
  }

  if (!saved && !sent) {
    return NextResponse.json(
      { error: "Couldn't send that just now. Please email ramesh@svyam.co directly." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
