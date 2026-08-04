import { NextRequest, NextResponse } from 'next/server';

import { SUPABASE_URL } from '@/lib/workshops';

/**
 * Admin CRUD for the GPT Garden (public.gpts). Reads and writes go through
 * the service-role key so RLS stays closed to the public for writes; the
 * /gpts page itself reads with the anon key.
 */

function unauthorized(req: NextRequest): NextResponse | null {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD env var not set' }, { status: 500 });
  }
  const password = req.headers.get('x-admin-password')?.trim();
  if (!password || password !== adminPw.trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function serviceHeaders(): Record<string, string> | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };
}

export async function GET(req: NextRequest) {
  const denied = unauthorized(req);
  if (denied) return denied;
  const headers = serviceHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/gpts?select=*&order=name.asc`, {
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    return NextResponse.json({ error: `Supabase read failed (${res.status})` }, { status: 502 });
  }
  const rows = await res.json();
  const hasActiveColumn = Array.isArray(rows) && rows.length > 0 && 'active' in rows[0];
  return NextResponse.json({ gpts: rows, hasActiveColumn });
}

interface GptBody {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  category?: unknown;
  icon?: unknown;
  url?: unknown;
  active?: unknown;
}

function str(v: unknown, max: number): string | null {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max ? v.trim() : null;
}

export async function POST(req: NextRequest) {
  const denied = unauthorized(req);
  if (denied) return denied;
  const headers = serviceHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }

  let body: GptBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = str(body.name, 120);
  const description = str(body.description, 2000);
  const category = str(body.category, 60);
  const url = str(body.url, 500);
  const icon = str(body.icon, 16) ?? '🤖';
  if (!name || !description || !category || !url || !/^https?:\/\//.test(url)) {
    return NextResponse.json(
      { error: 'name, description, category and a valid url are required' },
      { status: 400 },
    );
  }

  const row: Record<string, unknown> = { name, description, category, icon, url };
  if (typeof body.active === 'boolean') row.active = body.active;

  const id = typeof body.id === 'string' && body.id ? body.id : null;
  const target = id
    ? `${SUPABASE_URL}/rest/v1/gpts?id=eq.${encodeURIComponent(id)}`
    : `${SUPABASE_URL}/rest/v1/gpts`;

  const res = await fetch(target, {
    method: id ? 'PATCH' : 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    // A PATCH containing `active` fails while the column doesn't exist yet.
    return NextResponse.json({ error: `Save failed (${res.status}): ${detail}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const denied = unauthorized(req);
  if (denied) return denied;
  const headers = serviceHeaders();
  if (!headers) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
  }
  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const id = typeof body.id === 'string' ? body.id : '';
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/gpts?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    return NextResponse.json({ error: `Delete failed (${res.status})` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
