import { NextRequest, NextResponse } from "next/server";

// THE LIST — every email across the brand lands in Supabase public.people.
// The anon key is public by design (it also ships in playwithprompts.com's
// client bundle); RLS only allows INSERT, so the list can never be read back.
const SUPABASE_URL = "https://nbfkibomkxvqyaoakmma.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmtpYm9ta3h2cXlhb2FrbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjY0NjIsImV4cCI6MjA2MTAwMjQ2Mn0._d4WZD7t7_7QwRf_2lTku_9xJsiv20WqN__7_vfI_tA";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { email?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const source =
    typeof body.source === "string" && body.source.length <= 64
      ? body.source
      : "newsletter";

  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/people`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, source }),
    });
    if (resp.ok) {
      return NextResponse.json({ ok: true, alreadySubscribed: false });
    }
    if (resp.status === 409) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  }
}
