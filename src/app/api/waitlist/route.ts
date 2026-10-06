import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { sendLaunchCircleConfirmation } from "@/lib/launch-email";
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

  // Supabase first, unchanged: it decides the waitlist position and who gets
  // an advance copy, and nothing below may alter that outcome.
  const result = await joinWaitlist(email);
  if (result.status === "error") {
    return NextResponse.json(
      { error: "Couldn't add you just now. Please try again in a moment." },
      { status: 502 }
    );
  }

  // The page shows a live "N of 50 left" count. Mark it stale so the next
  // visit reads the new total instead of waiting out the one-minute cache.
  revalidatePath("/vibe-coding-os");

  // The book list stays in Supabase until launch, when it is imported into
  // Substack, so nothing is handed to Substack here. A new member gets one
  // confirmation email; someone already on the list doesn't get a second.
  if (result.status === "joined") {
    await sendLaunchCircleConfirmation(email);
  }

  if (result.status === "already") {
    return NextResponse.json({ ok: true, already: true });
  }
  return NextResponse.json({ ok: true, position: result.position, arc: result.arc });
}
