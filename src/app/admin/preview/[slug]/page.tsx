import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BuildDetail } from '@/components/build/BuildDetail';
import { findBuild, findPackFile, seoTitleFor } from '@/lib/builds';

import { PreviewBanner, PreviewLocked, isPreviewing } from '../preview-shell';

/** One build teardown, draft or published, rendered exactly as it will ship. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Build preview',
  robots: { index: false, follow: false },
};

export default async function BuildPreviewDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isPreviewing())) return <PreviewLocked />;

  const { slug } = await props.params;
  const build = await findBuild(slug);
  if (!build) notFound();

  const pack = build.download_file ? await findPackFile(slug, build.download_file) : null;

  return (
    <>
      <PreviewBanner note={`title: ${seoTitleFor(build)}`} />
      <BuildDetail build={build} packFileName={pack?.name ?? null} previewing />
    </>
  );
}
