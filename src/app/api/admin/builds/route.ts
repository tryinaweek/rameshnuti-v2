import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/admin-auth';
import { readSignupStats } from '@/lib/build-signups';
import {
  Build,
  deleteBuild,
  findBuild,
  listPackFiles,
  normalizeBuild,
  readAllBuilds,
  saveBuild,
  slugify,
} from '@/lib/builds';

/** Admin CRUD for Build With Me editions. */

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const slug = req.nextUrl.searchParams.get('slug');

  // One build, in full, for the editor.
  if (slug) {
    const build = await findBuild(slug);
    if (!build) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ build, packFiles: await listPackFiles(slug) });
  }

  const builds = await readAllBuilds();
  const stats = await readSignupStats();
  return NextResponse.json({
    builds: builds.map((b) => ({
      ...b,
      signups: stats ? (stats.byBuild[b.slug] ?? 0) : null,
    })),
    statsAvailable: stats !== null,
    signupsBySource: stats?.bySource ?? {},
  });
}

/** Create or update. A build is identified by its slug. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Partial<Build>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const title = (body.title ?? '').trim();
  if (!title || title.length > 160) {
    return NextResponse.json({ error: 'A build title is required' }, { status: 400 });
  }

  const slug = slugify(body.slug || title);
  if (!slug) {
    return NextResponse.json(
      { error: 'The title must contain letters or numbers' },
      { status: 400 },
    );
  }

  const existing = await readAllBuilds();
  const known = existing.find((b) => b.slug === slug);

  // A new build defaults to the next number in the series.
  const nextNumber = existing.reduce((max, b) => Math.max(max, b.build_number), 0) + 1;
  const buildNumber =
    typeof body.build_number === 'number' && body.build_number > 0
      ? body.build_number
      : (known?.build_number ?? nextNumber);

  const clash = existing.find((b) => b.build_number === buildNumber && b.slug !== slug);
  if (clash) {
    return NextResponse.json(
      { error: `Build #${buildNumber} is already "${clash.title}". Pick another number.` },
      { status: 409 },
    );
  }

  const build = normalizeBuild({ ...body, title, slug, build_number: buildNumber });

  try {
    await saveBuild(build);
  } catch {
    return NextResponse.json(
      { error: 'Could not save — is BLOB_READ_WRITE_TOKEN set on this project?' },
      { status: 502 },
    );
  }

  revalidatePath('/build');
  revalidatePath(`/build/${slug}`);
  revalidatePath('/');

  return NextResponse.json({ build });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: { slug?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const slug = typeof body.slug === 'string' ? body.slug : '';
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 });
  }

  try {
    await deleteBuild(slug);
  } catch {
    return NextResponse.json({ error: 'Could not delete' }, { status: 502 });
  }

  revalidatePath('/build');
  revalidatePath(`/build/${slug}`);
  return NextResponse.json({ ok: true });
}
