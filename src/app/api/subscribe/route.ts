import { NextRequest, NextResponse } from "next/server";

import { syncToSubstack } from "@/lib/substack";

/**
 * The single shared capture endpoint. Every form on the site, and any
 * outside system that captures an address (GoHighLevel workflows, via a
 * Webhook action), posts here with { email, name?, source }.
 *
 * Order matters and is deliberate:
 *   1. Supabase first — THE LIST is the memory layer, and the address must
 *      survive whatever happens next.
 *   2. Substack second — the mailing list. Best effort; a failure is logged
 *      and left for the reconciliation export, never shown to the visitor.
 *
 * Supabase never sends email. Substack is the only thing that ever will.
 */

// THE LIST — every email across the brand lands in Supabase public.people.
// The anon key is public by design (it also ships in playwithprompts.com's
// client bundle); RLS only allows INSERT, so the list can never be read back.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://nbfkibomkxvqyaoakmma.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmtpYm9ta3h2cXlhb2FrbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjY0NjIsImV4cCI6MjA2MTAwMjQ2Mn0._d4WZD7t7_7QwRf_2lTku_9xJsiv20WqN__7_vfI_tA";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Best-effort per-instance throttle; serverless resets it often, which is fine. */
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  let body: { email?: unknown; name?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const name =
    typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 120) : undefined;
  const source =
    typeof body.source === "string" && body.source.trim() && body.source.length <= 64
      ? body.source.trim()
      : "newsletter";

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many signups. Try again later." }, { status: 429 });
  }

  // 1. THE LIST.
  let alreadySubscribed = false;
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/people`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name ? { email, source, name } : { email, source }),
    });
    if (resp.status === 409) {
      alreadySubscribed = true;
    } else if (!resp.ok) {
      return NextResponse.json({ error: "Could not save" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 502 });
  }

  // 2. Substack. Never changes the visitor's outcome.
  const { substack, audited } = await syncToSubstack({ email, name, source });

  return NextResponse.json({
    ok: true,
    alreadySubscribed,
    substack: substack.ok ? "synced" : "pending",
    audited,
  });
}
