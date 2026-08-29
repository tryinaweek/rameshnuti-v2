import { list, put } from '@vercel/blob';

/**
 * Multi-workshop asset system.
 *
 * Layout in Vercel Blob:
 *   workshop/_registry.json      — the list of workshops (slug, title, createdAt)
 *   workshop/<slug>/<filename>   — that workshop's downloadable files
 *
 * Download events log to Supabase `workshop_downloads` (insert-only via the
 * public anon key, same trust model as THE LIST). The admin dashboard reads
 * counts back with SUPABASE_SERVICE_ROLE_KEY, which never ships to a browser.
 */

export interface Workshop {
  slug: string;
  title: string;
  createdAt: string;
}

export interface WorkshopFile {
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export const REGISTRY_PATH = 'workshop/_registry.json';

/** The original single workshop — legacy /workshop/resources maps here. */
export const DEFAULT_WORKSHOP: Workshop = {
  slug: 'ai-agent-workshop',
  title: 'AI Agent Workshop',
  createdAt: '2026-06-26T00:00:00.000Z',
};

export const SUPABASE_URL = 'https://nbfkibomkxvqyaoakmma.supabase.co';
// Public by design — insert-only under RLS (same key as /api/subscribe).
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iZmtpYm9ta3h2cXlhb2FrbW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjY0NjIsImV4cCI6MjA2MTAwMjQ2Mn0._d4WZD7t7_7QwRf_2lTku_9xJsiv20WqN__7_vfI_tA';

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

/** "research_workflow_n8n.json" → "Research Workflow N8n" */
export function prettifyFilename(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '');
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

export function fileExtension(filename: string): string {
  const m = filename.match(/\.([^.]+)$/);
  return m ? m[1].toUpperCase() : 'FILE';
}

export async function readRegistry(): Promise<Workshop[]> {
  // An unreachable blob store means "no workshops yet", not a crashed page.
  // Without this, prerendering /workshops fails the whole build wherever
  // BLOB_READ_WRITE_TOKEN isn't set (local builds, preview environments).
  let blobs: Awaited<ReturnType<typeof list>>['blobs'];
  try {
    ({ blobs } = await list({ prefix: REGISTRY_PATH, limit: 1 }));
  } catch {
    return [];
  }
  const entry = blobs.find((b) => b.pathname === REGISTRY_PATH);
  if (!entry) return [];
  // Blob URLs are CDN-cached; bust so admin edits show immediately.
  const res = await fetch(`${entry.url}?ts=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  try {
    const data = (await res.json()) as Workshop[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeRegistry(workshops: Workshop[]): Promise<void> {
  await put(REGISTRY_PATH, JSON.stringify(workshops, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
  });
}

export async function listWorkshopFiles(slug: string): Promise<WorkshopFile[]> {
  const prefix = `workshop/${slug}/`;
  let blobs: Awaited<ReturnType<typeof list>>['blobs'];
  try {
    ({ blobs } = await list({ prefix }));
  } catch {
    return [];
  }
  return blobs
    .filter((b) => b.pathname !== REGISTRY_PATH && b.size > 0)
    .map((b) => ({
      name: b.pathname.slice(prefix.length),
      url: b.url,
      size: b.size,
      uploadedAt:
        b.uploadedAt instanceof Date ? b.uploadedAt.toISOString() : String(b.uploadedAt),
    }))
    .filter((f) => f.name && !f.name.includes('/'));
}

export async function findWorkshop(slug: string): Promise<Workshop | null> {
  const registry = await readRegistry();
  return registry.find((w) => w.slug === slug) ?? null;
}

/** Fire-and-forget download log — must never block or fail a download. */
export function logDownload(workshop: string, filename: string): Promise<void> {
  return fetch(`${SUPABASE_URL}/rest/v1/workshop_downloads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ workshop, filename }),
  })
    .then(() => undefined)
    .catch(() => undefined);
}

export interface WorkshopStats {
  /** workshop slug → filename → count */
  downloads: Record<string, Record<string, number>>;
  /** workshop slug → emails captured (people rows with source workshop-<slug>) */
  emails: Record<string, number>;
}

/**
 * Admin-only stats. Requires SUPABASE_SERVICE_ROLE_KEY (server env); returns
 * null when it isn't configured so the dashboard can show a setup hint.
 */
export async function readStats(): Promise<WorkshopStats | null> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  const downloads: WorkshopStats['downloads'] = {};
  const emails: WorkshopStats['emails'] = {};

  try {
    const dlRes = await fetch(
      `${SUPABASE_URL}/rest/v1/workshop_downloads?select=workshop,filename&limit=50000`,
      { headers, cache: 'no-store' },
    );
    if (dlRes.ok) {
      const rows = (await dlRes.json()) as { workshop: string; filename: string }[];
      for (const row of rows) {
        downloads[row.workshop] ??= {};
        downloads[row.workshop][row.filename] =
          (downloads[row.workshop][row.filename] ?? 0) + 1;
      }
    }

    const emailRes = await fetch(
      `${SUPABASE_URL}/rest/v1/people?select=source&source=like.workshop*&limit=50000`,
      { headers, cache: 'no-store' },
    );
    if (emailRes.ok) {
      const rows = (await emailRes.json()) as { source: string }[];
      for (const row of rows) {
        // "workshop-<slug>", plus the legacy tags "workshop" and
        // "workshop-resources" which belong to the default workshop.
        const slug =
          row.source === 'workshop' || row.source === 'workshop-resources'
            ? DEFAULT_WORKSHOP.slug
            : row.source.replace(/^workshop-/, '');
        emails[slug] = (emails[slug] ?? 0) + 1;
      }
    }
  } catch {
    return null;
  }

  return { downloads, emails };
}
