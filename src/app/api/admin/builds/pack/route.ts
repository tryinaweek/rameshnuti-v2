import { NextRequest, NextResponse } from 'next/server';
import { del, put } from '@vercel/blob';

import { requireAdmin } from '@/lib/admin-auth';
import { listPackFiles } from '@/lib/builds';

/** Upload and remove the downloadable Build Pack for one build. */

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const slug = formData.get('slug');

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,64}$/.test(slug)) {
    return NextResponse.json({ error: 'A valid build slug is required' }, { status: 400 });
  }

  const filename = file.name.replace(/[/\\]/g, '_');
  const blob = await put(`build/${slug}/pack/${filename}`, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({
    file: { name: filename, url: blob.url },
    packFiles: await listPackFiles(slug),
  });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: { slug?: unknown; url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const slug = typeof body.slug === 'string' ? body.slug : '';
  const url = typeof body.url === 'string' ? body.url : '';
  if (!/^[a-z0-9-]{1,64}$/.test(slug) || !url) {
    return NextResponse.json({ error: 'slug and url required' }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ packFiles: await listPackFiles(slug) });
}
