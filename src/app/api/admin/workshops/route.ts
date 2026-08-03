import { NextRequest, NextResponse } from 'next/server';
import { copy, del, list } from '@vercel/blob';

import {
  DEFAULT_WORKSHOP,
  REGISTRY_PATH,
  Workshop,
  listWorkshopFiles,
  readRegistry,
  readStats,
  slugify,
  writeRegistry,
} from '@/lib/workshops';

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

/**
 * One-time, idempotent: files uploaded before workshops existed live at
 * workshop/<file>. Move them into the default workshop's folder and make sure
 * the registry exists.
 */
async function migrateLegacyLayout(registry: Workshop[]): Promise<Workshop[]> {
  let updated = registry;
  if (!registry.some((w) => w.slug === DEFAULT_WORKSHOP.slug)) {
    updated = [...registry, DEFAULT_WORKSHOP];
    await writeRegistry(updated);
  }

  const { blobs } = await list({ prefix: 'workshop/' });
  const legacy = blobs.filter(
    (b) =>
      b.pathname !== REGISTRY_PATH &&
      !b.pathname.slice('workshop/'.length).includes('/'),
  );
  for (const blob of legacy) {
    const filename = blob.pathname.slice('workshop/'.length);
    await copy(blob.url, `workshop/${DEFAULT_WORKSHOP.slug}/${filename}`, {
      access: 'public',
      addRandomSuffix: false,
    });
    await del(blob.url);
  }
  return updated;
}

export async function GET(req: NextRequest) {
  const denied = unauthorized(req);
  if (denied) return denied;

  let registry = await readRegistry();
  registry = await migrateLegacyLayout(registry);

  const stats = await readStats();

  const workshops = await Promise.all(
    registry.map(async (w) => {
      const files = await listWorkshopFiles(w.slug);
      const fileDownloads = stats?.downloads[w.slug] ?? {};
      return {
        ...w,
        files: files.map((f) => ({
          ...f,
          downloads: stats ? (fileDownloads[f.name] ?? 0) : null,
        })),
        totalDownloads: stats
          ? Object.values(fileDownloads).reduce((a, b) => a + b, 0)
          : null,
        emailsCaptured: stats ? (stats.emails[w.slug] ?? 0) : null,
      };
    }),
  );

  workshops.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ workshops, statsAvailable: stats !== null });
}

export async function POST(req: NextRequest) {
  const denied = unauthorized(req);
  if (denied) return denied;

  let body: { title?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title || title.length > 120) {
    return NextResponse.json({ error: 'A workshop name is required' }, { status: 400 });
  }
  const slug = slugify(title);
  if (!slug) {
    return NextResponse.json({ error: 'Name must contain letters or numbers' }, { status: 400 });
  }

  const registry = await readRegistry();
  if (registry.some((w) => w.slug === slug)) {
    return NextResponse.json({ error: `Workshop "${slug}" already exists` }, { status: 409 });
  }

  const workshop: Workshop = { slug, title, createdAt: new Date().toISOString() };
  await writeRegistry([...registry, workshop]);

  return NextResponse.json({ workshop }, { status: 201 });
}
