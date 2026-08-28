import { NextRequest, NextResponse } from 'next/server';

import { logBuildDownload } from '@/lib/build-signups';
import { findPackFile } from '@/lib/builds';

/**
 * Public Build Pack download: logs the click, then hands over the file.
 * /api/build-download?b=<build-slug>&f=<filename>
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('b') ?? '';
  const filename = req.nextUrl.searchParams.get('f') ?? '';

  if (!/^[a-z0-9-]{1,64}$/.test(slug) || !filename || filename.includes('/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const file = await findPackFile(slug, filename);
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Logging must never block or break a download.
  await logBuildDownload(slug, filename);

  return NextResponse.redirect(file.url, 302);
}
