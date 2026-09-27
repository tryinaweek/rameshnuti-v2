import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { NewsletterForm } from '@/components/NewsletterForm';
import { NEWSLETTER } from '@/lib/newsletter';
import { DEFAULT_WORKSHOP, findWorkshop } from '@/lib/workshops';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const workshop = await findWorkshop(slug);
  return {
    title: workshop ? `${workshop.title} | Ramesh Nuti` : 'Workshop | Ramesh Nuti',
    description: 'Unlock the downloads for this workshop.',
  };
}

export default async function WorkshopUnlockPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const cookieStore = await cookies();
  const unlocked =
    cookieStore.get(`unlocked_${slug}`)?.value === 'true' ||
    (slug === DEFAULT_WORKSHOP.slug &&
      cookieStore.get('unlocked_workshop')?.value === 'true');

  // The AI Agent Workshop already has its own gate at /workshop, with the
  // setup steps (and it's the URL on the event slides). One gate per workshop:
  // send visitors there rather than show a second, thinner copy of it.
  if (slug === DEFAULT_WORKSHOP.slug && !unlocked) redirect('/workshop');

  const workshop = await findWorkshop(slug);
  if (!workshop) notFound();
  if (unlocked) redirect(`/workshops/${slug}/resources`);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <div className="h-[3px] w-full bg-sig-bar" />
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-6 text-center">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            Workshop Downloads
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {workshop.title}
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Enter your email to unlock every file from this workshop — workflows,
            prompts, and guides. {NEWSLETTER.gateNote}
          </p>
          <div className="premium-card p-6">
            <NewsletterForm
              sourceTag={`workshop-${slug}`}
              variant="standard"
              buttonText={NEWSLETTER.gateButton}
              redirectTo={`/workshops/${slug}/resources`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
