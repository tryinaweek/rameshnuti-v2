import Link from 'next/link';
import { cookies } from 'next/headers';

import { PREVIEW_COOKIE, previewToken } from '@/lib/admin-auth';

/**
 * Shared gate for the two preview routes. The cookie is set by
 * /api/admin/builds/preview after an admin password check, so nothing here
 * needs to handle credentials itself.
 */
export async function isPreviewing(): Promise<boolean> {
  const token = previewToken();
  if (!token) return false;
  return (await cookies()).get(PREVIEW_COOKIE)?.value === token;
}

export function PreviewLocked() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white px-6 font-sans">
      <div className="max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Preview is off</h1>
        <p className="text-sm leading-relaxed text-slate-500">
          Open the Build With Me tab in the control panel and turn preview on. It stays on in
          this browser for 24 hours.
        </p>
        <Link href="/admin" className="btn-primary inline-block px-5 py-2.5 text-sm">
          Go to the control panel
        </Link>
      </div>
    </div>
  );
}

export function PreviewBanner({ note }: { note?: string }) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
      <p className="mx-auto max-w-4xl font-mono text-[11px] font-bold uppercase tracking-widest text-amber-700">
        Preview · drafts visible · not the live page{note ? ` · ${note}` : ''}
      </p>
    </div>
  );
}
