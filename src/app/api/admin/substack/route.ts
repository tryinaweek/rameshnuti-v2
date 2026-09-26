import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { markSubstackSynced } from "@/lib/substack";

/**
 * The supported fallback for getting addresses into Substack.
 *
 * GET  → a CSV of everyone on THE LIST not yet marked substack_synced, in the
 *        exact shape Substack's dashboard import accepts (Email, First Name).
 *        Import it at Settings → Subscribers → Import, then:
 * POST → { emails: [...] } marks those rows synced, so the next export is
 *        only what's new.
 *
 * Both need the service role key: the anon key can insert but never read.
 */

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://nbfkibomkxvqyaoakmma.supabase.co";

function serviceHeaders(): Record<string, string> | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return { apikey: key, Authorization: `Bearer ${key}` };
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const headers = serviceHeaders();
  if (!headers) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/people?select=email,name,source,first_seen&substack_synced=eq.false&order=first_seen.asc&limit=50000`,
    { headers, cache: "no-store" },
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: `Supabase read failed (${res.status}). Has docs/substack-sync.sql been run?` },
      { status: 502 },
    );
  }
  const rows = (await res.json()) as { email: string; name: string | null }[];

  const lines = ["Email,First Name"];
  for (const r of rows) {
    if (!r.email) continue;
    lines.push(`${csvCell(r.email.toLowerCase())},${csvCell((r.name ?? "").split(" ")[0])}`);
  }

  return new NextResponse(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="substack-import-${new Date().toISOString().slice(0, 10)}.csv"`,
      "X-Row-Count": String(rows.length),
    },
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: { emails?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const emails = Array.isArray(body.emails)
    ? body.emails.filter((e): e is string => typeof e === "string").slice(0, 5000)
    : [];
  if (emails.length === 0) {
    return NextResponse.json({ error: "emails[] required" }, { status: 400 });
  }

  let marked = 0;
  for (const email of emails) {
    if (await markSubstackSynced(email)) marked += 1;
  }
  return NextResponse.json({ ok: true, marked, of: emails.length });
}
