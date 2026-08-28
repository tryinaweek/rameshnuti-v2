import Link from 'next/link';

import { BuildPackForm } from '@/components/build/BuildPackForm';
import { CopyablePrompt } from '@/components/build/CopyablePrompt';
import { EmptySection, Field, Inline, Prose, Todo } from '@/components/build/Placeholder';
import { TrackedLink } from '@/components/build/TrackedLink';
import { TOOL_CATEGORIES, buildNumberLabel, isTodo, todoText, type Build } from '@/lib/build-types';

/**
 * One build teardown, sections 1 through 13. Shared with the admin preview
 * route, so a draft is reviewed as the exact page it will become.
 *
 * Everything on this page comes from the Build record. Adding next Saturday's
 * edition never means touching this file.
 */

const SECTIONS = [
  { id: 'the-build', label: 'The build' },
  { id: 'why', label: 'Why I built it' },
  { id: 'product-idea', label: 'The product idea' },
  { id: 'stack', label: 'The stack' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'prompts', label: 'The prompts' },
  { id: 'what-worked', label: 'What worked' },
  { id: 'what-failed', label: "What didn't" },
  { id: 'costs', label: 'Cost' },
  { id: 'business-model', label: 'Business model' },
  { id: 'ideas', label: '3 ideas' },
  { id: 'checklist', label: 'Build it yourself' },
  { id: 'build-pack', label: 'Build Pack' },
];

function SectionHeading({
  number,
  title,
  id,
  intro,
}: {
  number: number;
  title: string;
  id: string;
  intro?: string;
}) {
  return (
    <div className="space-y-2">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {String(number).padStart(2, '0')}
      </span>
      <h2
        id={id}
        className="scroll-mt-24 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
      >
        {title}
      </h2>
      {intro && <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{intro}</p>}
    </div>
  );
}

/** A bullet that keeps the amber treatment when it's still a TODO line. */
function Bullet({ value }: { value: string }) {
  const text = value.trim();
  if (isTodo(text)) {
    return (
      <li className="ml-1">
        <Todo>{todoText(text)}</Todo>
      </li>
    );
  }
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-slate-600">
      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
      <span>{text}</span>
    </li>
  );
}

export function BuildDetail({
  build,
  packFileName,
  previewing = false,
}: {
  build: Build;
  packFileName: string | null;
  previewing?: boolean;
}) {
  const toolsByCategory = TOOL_CATEGORIES.map((category) => ({
    category,
    items: build.tools.filter((t) => t.category === category),
  })).filter((g) => g.items.length > 0);
  const ungrouped = build.tools.filter(
    (t) => !TOOL_CATEGORIES.includes(t.category as (typeof TOOL_CATEGORIES)[number]),
  );

  const bm = build.business_model;
  const businessRows = [
    { label: 'How it makes money', value: bm.how_it_makes_money },
    { label: 'Pricing', value: bm.pricing },
    { label: 'Why I chose this pricing', value: bm.why_this_pricing },
    { label: "What I'd test next", value: bm.what_id_test_next },
  ];

  return (
    <article className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. THE BUILD */}
      <header id="the-build" className="scroll-mt-16 bg-brand-navy px-6 py-14 text-white md:py-20">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={previewing ? '/admin/preview' : '/build'}
              className="font-mono text-[11px] font-bold uppercase tracking-widest text-brand-cyan no-underline hover:underline"
            >
              &larr; Build With Me
            </Link>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/40">
              Build {buildNumberLabel(build.build_number)}
            </span>
            {build.status === 'draft' && (
              <span className="rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-amber-200">
                Draft
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl">
            {build.title}
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-300 md:text-lg">
            {build.short_description}
          </p>

          <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-5">
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/40">
                Difficulty
              </dt>
              <dd className="mt-0.5 text-xs font-semibold text-white">
                {build.difficulty || '—'}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/40">
                Build time
              </dt>
              <dd className="mt-0.5 text-xs font-semibold text-white">
                {build.estimated_build_time || '—'}
              </dd>
            </div>
            {build.publish_date && (
              <div>
                <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Published
                </dt>
                <dd className="mt-0.5 text-xs font-semibold text-white">
                  {new Date(build.publish_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </dl>

          {build.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {build.topics.map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {build.live_product_url ? (
            <TrackedLink
              href={build.live_product_url}
              event={`build: live product / ${build.slug}`}
              className="inline-block rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-900 no-underline transition-colors hover:bg-slate-100"
            >
              See it live &rarr;
            </TrackedLink>
          ) : (
            <Todo>Add the live product URL so people can try it.</Todo>
          )}
        </div>
      </header>

      {/* Screenshot / product image */}
      <div className="border-b border-slate-100 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          {build.hero_image ? (
            // Hero images are arbitrary URLs pasted into the admin panel
            // (blob uploads or external screenshots), so next/image's host
            // allowlist would reject the ones we can't know in advance.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={build.hero_image}
              alt={`${build.title} screenshot`}
              className="w-full rounded-2xl border border-slate-200 shadow-sm"
            />
          ) : (
            <EmptySection hint="Add a screenshot or product image of the build. One clear shot of the real thing beats a diagram here." />
          )}
        </div>
      </div>

      {/* Jump list — long pages, mostly read on a phone. */}
      <nav
        aria-label="Sections in this teardown"
        className="border-b border-slate-100 bg-slate-light px-6 py-5"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
            In this teardown
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-xs font-semibold text-slate-500 no-underline transition-colors hover:text-teal-accent"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl space-y-16 px-6 py-14 md:space-y-20 md:py-20">
        {/* 2. WHY I BUILT IT */}
        <section className="space-y-5">
          <SectionHeading number={2} id="why" title="Why I built it" />
          <Prose value={build.why_i_built_it} />
        </section>

        {/* 3. THE PRODUCT IDEA */}
        <section className="space-y-5">
          <SectionHeading
            number={3}
            id="product-idea"
            title="The product idea"
            intro="The whole experience, in the fewest steps that still make sense."
          />
          {build.product_flow.length === 0 ? (
            <EmptySection hint="Describe the experience as simple steps, one line each." />
          ) : (
            <ol className="space-y-3">
              {build.product_flow.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-[15px] leading-snug text-slate-700">
                    <Inline value={step} />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* 4. THE STACK */}
        <section className="space-y-5">
          <SectionHeading number={4} id="stack" title="The stack" />
          {build.tools.length === 0 ? (
            <EmptySection hint="List the main tools you used, grouped by what they did." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {[...toolsByCategory, ...(ungrouped.length ? [{ category: 'Other tools', items: ungrouped }] : [])].map(
                (group) => (
                  <div
                    key={group.category}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {group.category}
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {group.items.map((tool, i) => (
                        <li key={i}>
                          <span className="block text-sm font-semibold text-slate-900">
                            <Inline value={tool.name} />
                          </span>
                          {tool.note && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                              {tool.note}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="space-y-5">
          <SectionHeading
            number={5}
            id="how-it-works"
            title="How it works"
            intro="What happens, in order, from the moment someone starts."
          />
          {build.workflow.length === 0 ? (
            <EmptySection hint="Write the workflow as a chain of short steps." />
          ) : (
            <ol className="relative space-y-0 border-l-2 border-slate-200 pl-6">
              {build.workflow.map((step, i) => (
                <li key={i} className="relative pb-6 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-teal-accent"
                  />
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Step {i + 1}
                  </span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-slate-700">
                    <Inline value={step} />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* 6. THE PROMPTS */}
        <section className="space-y-5">
          <SectionHeading
            number={6}
            id="prompts"
            title="The prompts"
            intro="Copy them, change them, use them. They are pasted exactly as they ran."
          />
          {build.prompts.length === 0 ? (
            <EmptySection hint="Paste the actual prompts you used, one block each." />
          ) : (
            <div className="space-y-4">
              {build.prompts.map((prompt, i) =>
                isTodo(prompt.body) ? (
                  <EmptySection key={i} hint={todoText(prompt.body)} />
                ) : (
                  <CopyablePrompt
                    key={i}
                    label={prompt.label || `Prompt ${i + 1}`}
                    body={prompt.body}
                    note={prompt.note}
                    buildSlug={build.slug}
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* 7. WHAT WORKED */}
        <section className="space-y-5">
          <SectionHeading number={7} id="what-worked" title="What worked" />
          {build.what_worked.length === 0 ? (
            <EmptySection hint="A few short, practical lessons." />
          ) : (
            <ul className="space-y-3 rounded-xl border border-slate-200 bg-slate-light p-5">
              {build.what_worked.map((item, i) => (
                <Bullet key={i} value={item} />
              ))}
            </ul>
          )}
        </section>

        {/* 8. WHAT DIDN'T WORK */}
        <section className="space-y-5">
          <SectionHeading
            number={8}
            id="what-failed"
            title="What didn't work"
            intro="The failed approaches, the mistakes, the limits, and what I would change."
          />
          {build.what_failed.length === 0 ? (
            <EmptySection hint="This is the section people learn the most from. Be specific about what broke." />
          ) : (
            <ul className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
              {build.what_failed.map((item, i) => (
                <Bullet key={i} value={item} />
              ))}
            </ul>
          )}
        </section>

        {/* 9. COST TO BUILD / RUN */}
        <section className="space-y-5">
          <SectionHeading
            number={9}
            id="costs"
            title="Cost to build and run"
            intro="Approximate. Enough to tell you whether this is worth your weekend."
          />
          {build.costs.length === 0 ? (
            <EmptySection hint="Add the rough monthly cost of each line: AI/API, hosting, database, payment fees, everything else." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[420px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-light">
                    <th className="px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Line item
                    </th>
                    <th className="px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Cost
                    </th>
                    <th className="px-5 py-3 font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {build.costs.map((cost, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">
                        {cost.item}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-sm text-slate-700">
                        <Inline value={cost.amount} />
                      </td>
                      <td className="px-5 py-3.5 text-xs leading-relaxed text-slate-500">
                        {cost.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 10. PRODUCT / BUSINESS MODEL */}
        <section className="space-y-5">
          <SectionHeading number={10} id="business-model" title="Product and business model" />
          <div className="grid gap-4 sm:grid-cols-2">
            {businessRows.map((row) => (
              <div key={row.label} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {row.label}
                </p>
                <div className="mt-2">
                  <Field value={row.value} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. 3 IDEAS YOU CAN BUILD FROM THIS */}
        <section className="space-y-5">
          <SectionHeading
            number={11}
            id="ideas"
            title="3 ideas you can build from this"
            intro="Same concept, different product. Pick one and build the smallest version."
          />
          {build.three_build_ideas.length === 0 ? (
            <EmptySection hint="Add exactly three adjacent product ideas." />
          ) : (
            <div className="grid gap-5">
              {build.three_build_ideas.map((idea, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-slate-light p-6">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
                    Idea {i + 1}
                  </span>
                  <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900">
                    {idea.name}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">
                    {idea.description}
                  </p>
                  <dl className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Who it&apos;s for
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                        <Field value={idea.who_its_for} className="text-sm text-slate-600" />
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        Simplest MVP
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                        <Field value={idea.mvp} className="text-sm text-slate-600" />
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 12. BUILD IT YOURSELF */}
        <section className="space-y-5">
          <SectionHeading number={12} id="checklist" title="Build it yourself" />
          {build.build_checklist.length === 0 ? (
            <EmptySection hint="Add the checklist someone should follow to build their own version." />
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {build.build_checklist.map((item, i) => (
                <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 font-mono text-[10px] text-slate-300"
                  >
                    ✓
                  </span>
                  <span className="text-[15px] leading-snug text-slate-700">
                    <Inline value={item} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 13. DOWNLOAD THE BUILD PACK */}
      <section id="build-pack" className="scroll-mt-24 border-t border-slate-100 bg-slate-light px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="premium-card p-6 md:p-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
              Want the prompts, checklist, and build notes?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              The teardown is free. If you want the downloadable prompt pack, workflow
              checklist, and future Build With Me resources, I can send them to you.
            </p>
            <div className="mt-6">
              <BuildPackForm
                buildSlug={build.slug}
                buildTitle={build.title}
                hasPack={packFileName !== null}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            <Link href="/build" className="font-semibold text-teal-accent hover:underline">
              Back to the Build Library
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
