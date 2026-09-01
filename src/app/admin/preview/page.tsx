import type { Metadata } from 'next';

import { BuildLibrary } from '@/components/build/BuildLibrary';
import { readAllBuilds } from '@/lib/builds';

import { PreviewBanner, PreviewLocked, isPreviewing } from './preview-shell';

/**
 * The Build Library exactly as it will look, drafts included. Reachable only
 * from the browser that turned preview on in the admin panel.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Build preview',
  robots: { index: false, follow: false },
};

export default async function BuildPreviewLibraryPage() {
  if (!(await isPreviewing())) return <PreviewLocked />;

  return (
    <>
      <PreviewBanner />
      <BuildLibrary builds={await readAllBuilds()} previewing />
    </>
  );
}
