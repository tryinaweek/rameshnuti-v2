import { NextRequest, NextResponse } from "next/server";

import { joinWaitlist } from "@/lib/waitlist";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const result = await joinWaitlist(email);
  if (result.status === "error") {
    return NextResponse.json(
      { error: "Couldn't add you just now. Please try again in a moment." },
      { status: 502 }
    );
  }
  if (result.status === "already") {
    return NextResponse.json({ ok: true, already: true });
  }
  return NextResponse.json({ ok: true, position: result.position, arc: result.arc });
}
