import type { Metadata } from 'next';
import Link from 'next/link';

import { listWorkshopFiles, readRegistry } from '@/lib/workshops';

export const metadata: Metadata = {
  title: 'Workshops',
  description:
    'Download the workflows, prompts, and guides from workshops Ramesh Nuti has run — free, unlocked with your email.',
  alternates: { canonical: 'https://rameshnuti.com/workshops' },
};

// New uploads surface within a minute — a workshop is listed publicly only
// once it actually has files to download.
export const revalidate = 60;

export default async function WorkshopsIndexPage() {
  const registry = await readRegistry();

  const workshops = (
    await Promise.all(
      registry.map(async (w) => ({
        ...w,
        fileCount: (await listWorkshopFiles(w.slug)).length,
      })),
    )
  )
    .filter((w) => w.fileCount > 0)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Workshops
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Every workshop I run ships with real, working assets — n8n workflows, agent
            prompts, guides. Grab them here, free. Want one run for your team?{' '}
            <Link href="/workshop" className="text-teal-accent font-semibold hover:underline">
              Here&apos;s how that works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Workshop list */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        {workshops.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 text-sm">
              Workshop materials will appear here after the next session. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workshops.map((w) => (
              <Link
                key={w.slug}
                href={`/workshops/${w.slug}`}
                className="flex items-center gap-5 premium-card p-6 no-underline hover:border-teal-accent/30 group text-left"
              >
                <span className="text-2xl shrink-0 w-10 text-center text-slate-400 group-hover:text-teal-accent transition-colors">
                  🎓
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-base font-bold group-hover:text-teal-accent transition-colors tracking-tight">
                    {w.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-1 font-mono">
                    {w.fileCount} download{w.fileCount === 1 ? '' : 's'} &middot;{' '}
                    {new Date(w.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-teal-accent group-hover:translate-x-1 transition-all font-bold text-lg select-none">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
