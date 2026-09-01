import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BuildDetail } from '@/components/build/BuildDetail';
import {
  buildNumberLabel,
  findBuild,
  findPackFile,
  isTodo,
  readPublishedBuilds,
  seoTitleFor,
} from '@/lib/builds';

export const revalidate = 60;

/** Prerender every published build; new ones fill in on first request. */
export async function generateStaticParams() {
  const builds = await readPublishedBuilds();
  return builds.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const build = await findBuild(slug);
  if (!build || build.status !== 'published') {
    return { title: 'Build With Me | Ramesh Nuti' };
  }

  const title = seoTitleFor(build);
  const description = build.seo_description.trim() || build.short_description;
  const url = `https://rameshnuti.com/build/${slug}`;
  const image = build.og_image || build.hero_image || '/og-image.png';

  return {
    // absolute: the site-wide "%s | Ramesh Nuti" template would make these
    // titles too long for a search result.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: build.publish_date || undefined,
      authors: ['Ramesh Nuti'],
      images: [{ url: image, width: 1200, height: 630, alt: build.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function BuildDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const build = await findBuild(slug);
  if (!build || build.status !== 'published') notFound();

  const pack = build.download_file ? await findPackFile(slug, build.download_file) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: seoTitleFor(build),
    name: `${build.title} — Build ${buildNumberLabel(build.build_number)}`,
    description: build.seo_description.trim() || build.short_description,
    url: `https://rameshnuti.com/build/${slug}`,
    datePublished: build.publish_date || undefined,
    dateModified: build.updated_at,
    image: build.og_image || build.hero_image || undefined,
    keywords: build.topics.join(', ') || undefined,
    author: { '@type': 'Person', name: 'Ramesh Nuti', url: 'https://rameshnuti.com' },
    publisher: { '@type': 'Person', name: 'Ramesh Nuti', url: 'https://rameshnuti.com' },
    isAccessibleForFree: true,
    // Only advertise steps that are actually written.
    step: build.workflow
      .filter((s) => !isTodo(s))
      .map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BuildDetail build={build} packFileName={pack?.name ?? null} />
    </>
  );
}
