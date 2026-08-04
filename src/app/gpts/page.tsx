import type { Metadata } from 'next';

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/workshops';

export const metadata: Metadata = {
  title: 'GPT Garden',
  description:
    'Custom GPTs and AI agents built by Ramesh Nuti — legal translation, EDI validation, startup tools, writing helpers, and more. Free to use.',
  alternates: { canonical: 'https://rameshnuti.com/gpts' },
};

// The gpts table (brand Supabase, public-read) was GPT Garden's backend at
// ailab.svyam.co — the collection now lives here, on the personal brand.
// Rows are managed in the Supabase Table Editor.
export const revalidate = 60;

interface GptRow {
  id: string;
  name: string;
  description: string;
  category: string | null;
  icon: string | null;
  url: string | null;
  position: number | null;
}

async function fetchGpts(): Promise<GptRow[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/gpts?select=id,name,description,category,icon,url,position&order=name.asc`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return [];
    return (await res.json()) as GptRow[];
  } catch {
    return [];
  }
}

export default async function GptGardenPage() {
  const gpts = (await fetchGpts()).filter((g) => g.url);

  const byCategory = new Map<string, GptRow[]>();
  for (const gpt of gpts) {
    const cat = gpt.category ?? 'More';
    byCategory.set(cat, [...(byCategory.get(cat) ?? []), gpt]);
  }
  const categories = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            🌱 The Lab · GPT wing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            GPT Garden
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            {`${gpts.length} custom GPTs and agents I've built for real work — contracts, EDI files, startup decks, writing. All free to use; most open directly in ChatGPT.`}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-6 max-w-4xl mx-auto space-y-12">
        {categories.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 text-sm">The garden is being replanted — check back soon.</p>
          </div>
        ) : (
          categories.map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((gpt) => (
                  <a
                    key={gpt.id}
                    href={gpt.url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="premium-card p-5 no-underline hover:border-teal-accent/30 group text-left flex gap-4"
                  >
                    <span className="text-2xl shrink-0 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {gpt.icon ?? '🤖'}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="block text-slate-900 text-sm font-bold group-hover:text-teal-accent transition-colors tracking-tight">
                          {gpt.name}
                        </span>
                        <span className="text-slate-300 group-hover:text-teal-accent group-hover:translate-x-0.5 transition-all font-bold select-none">
                          ↗
                        </span>
                      </span>
                      <span className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-3">
                        {gpt.description}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* Cross-link to the rest of the estate */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto premium-card p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Want the full workshop?
            </h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-md">
              These GPTs are single tools. The Lab has the full apps — and the workshops
              teach you to build your own.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a href="/lab" className="btn-primary px-5 py-2.5 text-xs no-underline">
              The Lab &rarr;
            </a>
            <a
              href="/workshops"
              className="px-5 py-2.5 text-xs font-bold text-teal-accent border border-teal-accent/25 bg-teal-accent/5 hover:bg-teal-accent hover:text-white rounded-lg transition-colors no-underline"
            >
              Workshops &rarr;
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
