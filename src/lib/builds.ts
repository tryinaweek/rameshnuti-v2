import { list, put, del } from '@vercel/blob';

import { SEED_BUILDS } from '@/data/builds';
import {
  REGISTRY_PATH,
  toSummary,
  normalizeBuild,
  type Build,
  type BuildPackFile,
  type BuildSummary,
} from '@/lib/build-types';

/**
 * Build With Me — reading and writing builds in Vercel Blob.
 *
 * One build ships every Saturday. Adding one must never mean touching a
 * component, so everything a build page renders lives in the record and is
 * edited from /admin (the "Build With Me" tab).
 *
 * Layout in Vercel Blob:
 *   build/_registry.json            — card summaries, in build-number order
 *   build/<slug>/build.json         — the full record for one build
 *   build/<slug>/pack/<filename>    — that build's downloadable Build Pack
 *
 * The registry is always derived from the full records on write, so the two
 * can never drift. SEED_BUILDS supplies Build #001 before anything has been
 * saved, and also keeps the section working if the blob store is unreachable.
 *
 * Types and pure helpers live in @/lib/build-types and are re-exported here so
 * server code can keep importing everything from one place.
 */
export * from '@/lib/build-types';

async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const entry = blobs.find((b) => b.pathname === pathname);
    if (!entry) return null;
    // Blob URLs are CDN-cached; bust so admin edits show immediately.
    const res = await fetch(`${entry.url}?ts=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Newest build first. */
function byNumberDesc(a: { build_number: number }, b: { build_number: number }): number {
  return b.build_number - a.build_number;
}

/**
 * Every build. The seeds stand in until a registry exists; from the first save
 * onward the registry is the only list, so a deleted build stays deleted. The
 * first save folds the seed summaries into the registry, which is why Build
 * #001 survives saving Build #002.
 */
export async function readAllBuilds(): Promise<BuildSummary[]> {
  const stored = await readJson<BuildSummary[]>(REGISTRY_PATH);
  if (!stored || stored.length === 0) {
    return SEED_BUILDS.map(toSummary).sort(byNumberDesc);
  }
  return [...stored].sort(byNumberDesc);
}

export async function readPublishedBuilds(): Promise<BuildSummary[]> {
  return (await readAllBuilds()).filter((b) => b.status === 'published');
}

/**
 * A saved record always wins. The seed is the fallback for a build the
 * registry still lists but nobody has edited yet — editing Build #001 in the
 * admin panel replaces the shipped placeholder version for good.
 */
export async function findBuild(slug: string): Promise<Build | null> {
  const stored = await readJson<Partial<Build>>(`build/${slug}/build.json`);
  if (stored) return normalizeBuild(stored);

  const seed = SEED_BUILDS.find((b) => b.slug === slug);
  if (!seed) return null;

  const registry = await readJson<BuildSummary[]>(REGISTRY_PATH);
  const deleted = registry !== null && !registry.some((b) => b.slug === slug);
  return deleted ? null : normalizeBuild(seed);
}

/** The build shown on the homepage: newest published build flagged featured. */
export async function findFeaturedBuild(): Promise<BuildSummary | null> {
  const published = await readPublishedBuilds();
  return published.find((b) => b.featured_on_home) ?? null;
}

/** Writes the full record, then rebuilds the registry from every record. */
export async function saveBuild(build: Build): Promise<void> {
  const record = { ...build, updated_at: new Date().toISOString() };
  await put(`build/${record.slug}/build.json`, JSON.stringify(record, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
  });

  const existing = await readAllBuilds();
  const registry = [
    ...existing.filter((b) => b.slug !== record.slug),
    toSummary(record),
  ].sort(byNumberDesc);
  await writeRegistry(registry);
}

export async function writeRegistry(registry: BuildSummary[]): Promise<void> {
  await put(REGISTRY_PATH, JSON.stringify(registry, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

export async function deleteBuild(slug: string): Promise<void> {
  const { blobs } = await list({ prefix: `build/${slug}/` });
  for (const blob of blobs) {
    await del(blob.url);
  }
  const registry = (await readJson<BuildSummary[]>(REGISTRY_PATH)) ?? [];
  await writeRegistry(registry.filter((b) => b.slug !== slug));
}

export async function listPackFiles(slug: string): Promise<BuildPackFile[]> {
  const prefix = `build/${slug}/pack/`;
  try {
    const { blobs } = await list({ prefix });
    return blobs
      .filter((b) => b.size > 0)
      .map((b) => ({
        name: b.pathname.slice(prefix.length),
        url: b.url,
        size: b.size,
        uploadedAt:
          b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
      }))
      .filter((f) => f.name && !f.name.includes('/'));
  } catch {
    return [];
  }
}

export async function findPackFile(
  slug: string,
  filename: string,
): Promise<BuildPackFile | null> {
  const files = await listPackFiles(slug);
  return files.find((f) => f.name === filename) ?? null;
}
