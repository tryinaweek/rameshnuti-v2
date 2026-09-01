import Link from 'next/link';

import { NewsletterForm } from '@/components/NewsletterForm';
import { buildNumberLabel, type BuildSummary } from '@/lib/build-types';

/**
 * The /build page body. Shared with the admin preview route so what gets
 * reviewed before publishing is the real page, not a stand-in for it.
 */

export const BUILD_TITLE = 'Build With Me | Real AI Builds, Broken Down';
export const BUILD_DESCRIPTION =
  'A free library of real AI builds. Every Saturday: the tools, prompts, workflow, mistakes, costs, and three ideas you can build yourself.';
export const BUILD_URL = 'https://rameshnuti.com/build';

const HOW_IT_WORKS = [
  { step: '01', text: 'I build something' },
  { step: '02', text: 'I break down what happened' },
  { step: '03', text: 'You get the prompts, workflow, and lessons' },
  { step: '04', text: 'You decide what you want to build from it' },
];

export function BuildLibrary({
  builds,
  previewing = false,
}: {
  builds: BuildSummary[];
  previewing?: boolean;
}) {
  const hrefFor = (slug: string) =>
    previewing ? `/admin/preview/${slug}` : `/build/${slug}`;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Hero — the section's own identity: dark, numbered, notebook-like. */}
      <section className="bg-brand-navy px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl space-y-6">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-cyan">
            A public build notebook
          </span>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            Build With Me
          </h1>
          <p className="max-w-2xl text-lg leading-snug text-slate-200 md:text-2xl">
            Real AI builds. Real lessons. Ideas you can steal and try yourself.
          </p>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
            Every Saturday, I break down something I actually built or tested. You&apos;ll see
            the tools, prompts, mistakes, costs, product decisions, and a few ideas you can
            build from the same concept.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a
              href="#builds"
              className="rounded-lg bg-white px-6 py-3.5 text-center text-sm font-bold text-slate-900 no-underline transition-colors hover:bg-slate-100"
            >
              Explore the builds
            </a>
            <a
              href="#next-build"
              className="rounded-lg border border-white/25 px-6 py-3.5 text-center text-sm font-bold text-white no-underline transition-colors hover:bg-white/10"
            >
              Get the next build
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-100 px-6 py-14 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            How it works
          </h2>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step} className="space-y-2">
                <span className="block font-mono text-2xl font-bold text-teal-accent">
                  {s.step}
                </span>
                <p className="text-[15px] font-semibold leading-snug text-slate-900">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The library */}
      <section id="builds" className="scroll-mt-20 px-6 py-14 md:py-20">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              The Build Library
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-slate-500">
              Every teardown is free to read. No signup, no paywall, no course funnel.
            </p>
          </div>

          {builds.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-light p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                The first build goes up shortly.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
                Drop your email below and it lands in your inbox on Saturday.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {builds.map((build) => (
                <Link
                  key={build.slug}
                  href={hrefFor(build.slug)}
                  className="premium-card group block p-6 no-underline md:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold tracking-widest text-teal-accent">
                      BUILD {buildNumberLabel(build.build_number)}
                    </span>
                    {build.status === 'draft' && (
                      <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-700">
                        Draft
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-teal-accent md:text-2xl">
                    {build.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                    {build.short_description}
                  </p>

                  <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-100 pt-5">
                    <div>
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Difficulty
                      </dt>
                      <dd className="mt-0.5 text-xs font-semibold text-slate-700">
                        {build.difficulty || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Build time
                      </dt>
                      <dd className="mt-0.5 text-xs font-semibold text-slate-700">
                        {build.estimated_build_time || '—'}
                      </dd>
                    </div>
                  </dl>

                  {build.topics.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {build.topics.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="btn-primary mt-6 inline-block px-5 py-2.5 text-xs">
                    View build &rarr;
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Get the next build */}
      <section
        id="next-build"
        className="scroll-mt-20 border-t border-slate-100 bg-slate-light px-6 py-16"
      >
        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Get the next build
          </h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-600">
            One build every Saturday: what I made, what it cost, what broke, and what you
            could make from it.
          </p>
          <NewsletterForm
            sourceTag="build-with-me"
            variant="standard"
            buttonText="Send me the builds"
            placeholder="Email address"
          />
          <p className="text-[11px] leading-relaxed text-slate-500">
            No spam. Just new builds, prompts, and practical AI experiments. Unsubscribe
            anytime.{' '}
            <Link href="/privacy" className="font-semibold text-teal-accent hover:underline">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
