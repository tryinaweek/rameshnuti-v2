import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin gate for the Substack catch-up route: the same `x-admin-password`
 * header the workshop and GPT admin routes already use.
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
