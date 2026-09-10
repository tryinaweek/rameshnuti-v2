import { NextRequest, NextResponse } from 'next/server';

import { EMAIL_COOKIE, listWorkshopFiles, logDownload } from '@/lib/workshops';

/**
 * Public download endpoint: logs the event, then hands the visitor the file.
 * /api/download?w=<workshop-slug>&f=<filename>
 *
 * The email cookie is set at the gate, so a download made in the same browser
 * is attributed to the person who unlocked it. A direct or shared link carries
 * no cookie and is logged without an address rather than being refused — this
 * endpoint has never gated access, and the underlying blob URL is public.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('w') ?? '';
  const filename = req.nextUrl.searchParams.get('f') ?? '';

  if (!/^[a-z0-9-]{1,64}$/.test(slug) || !filename || filename.includes('/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const files = await listWorkshopFiles(slug);
  const file = files.find((f) => f.name === filename);
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Cookie values are URI-encoded on the way in; a malformed one is anonymous.
  const raw = req.cookies.get(EMAIL_COOKIE)?.value;
  let email: string | null = null;
  if (raw) {
    try {
      email = decodeURIComponent(raw);
    } catch {
      email = null;
    }
  }

  // Never let logging block or break the download.
  await logDownload(slug, filename, email);

  return NextResponse.redirect(file.url, 302);
}
