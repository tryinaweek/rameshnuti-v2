import type { Metadata } from 'next';

import {
  BUILD_DESCRIPTION,
  BUILD_TITLE,
  BUILD_URL,
  BuildLibrary,
} from '@/components/build/BuildLibrary';
import { buildNumberLabel, readPublishedBuilds } from '@/lib/builds';

export const revalidate = 60;

export const metadata: Metadata = {
  // absolute: this title already names the section and the site's "%s | Ramesh
  // Nuti" template would push it past what a search result shows.
  title: { absolute: BUILD_TITLE },
  description: BUILD_DESCRIPTION,
  alternates: { canonical: BUILD_URL },
  openGraph: {
    type: 'website',
    url: BUILD_URL,
    title: BUILD_TITLE,
    description: BUILD_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Build With Me' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BUILD_TITLE,
    description: BUILD_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default async function BuildLibraryPage() {
  const builds = await readPublishedBuilds();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Build With Me',
    description: BUILD_DESCRIPTION,
    url: BUILD_URL,
    author: { '@type': 'Person', name: 'Ramesh Nuti', url: 'https://rameshnuti.com' },
    hasPart: builds.map((b) => ({
      '@type': 'TechArticle',
      headline: `${b.title} — Build ${buildNumberLabel(b.build_number)}`,
      description: b.short_description,
      url: `${BUILD_URL}/${b.slug}`,
      datePublished: b.publish_date || undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BuildLibrary builds={builds} />
    </>
  );
}
