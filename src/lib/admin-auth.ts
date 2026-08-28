import { createHash } from 'crypto';

import { NextRequest, NextResponse } from 'next/server';

/**
 * Shared admin gate for the Build With Me routes: the same
 * `x-admin-password` header the workshop and GPT admin routes already use.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD env var not set' }, { status: 500 });
  }
  const provided = req.headers.get('x-admin-password')?.trim();
  if (!provided || provided !== adminPw.trim()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export const PREVIEW_COOKIE = 'build_preview';

/**
 * Preview token for unpublished builds. A hash of the admin password, so the
 * cookie can be verified on any request without the password itself ever
 * being stored in the browser or passed through a URL.
 */
export function previewToken(): string | null {
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return null;
  return createHash('sha256').update(`build-preview:${adminPw.trim()}`).digest('hex');
}
