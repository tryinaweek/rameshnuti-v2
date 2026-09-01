import { NextRequest, NextResponse } from 'next/server';

import { PREVIEW_COOKIE, previewToken, requireAdmin } from '@/lib/admin-auth';

/**
 * Turns draft preview on and off for this browser. With the cookie set, an
 * unpublished build renders at its real URL, so what gets reviewed is the
 * actual page rather than an approximation of it.
 */

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const token = previewToken();
  if (!token) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD env var not set' }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, previewing: true });
  res.cookies.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  });
  return res;
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const res = NextResponse.json({ ok: true, previewing: false });
  res.cookies.delete(PREVIEW_COOKIE);
  return res;
}
