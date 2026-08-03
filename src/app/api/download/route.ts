import { NextRequest, NextResponse } from 'next/server';

import { listWorkshopFiles, logDownload } from '@/lib/workshops';

/**
 * Public download endpoint: logs the event, then hands the visitor the file.
 * /api/download?w=<workshop-slug>&f=<filename>
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

  // Never let logging block or break the download.
  await logDownload(slug, filename);

  return NextResponse.redirect(file.url, 302);
}
