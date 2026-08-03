import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { NewsletterForm } from '@/components/NewsletterForm';
import {
  DEFAULT_WORKSHOP,
  fileExtension,
  findWorkshop,
  listWorkshopFiles,
  prettifyFilename,
} from '@/lib/workshops';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const workshop = await findWorkshop(slug);
  return {
    title: workshop
      ? `${workshop.title} — Resources | Ramesh Nuti`
      : 'Workshop Resources | Ramesh Nuti',
    description: 'Download the workflows, prompts, and guides from this workshop.',
  };
}

// The original n8n agent workshop has extra how-to content baked in.
const N8N_QUICK_START = [
  {
    num: '01',
    title: 'Import the JSON',
    desc: 'In n8n, click the ... menu at top-right, select "Import from File", choose the JSON.',
  },
  {
    num: '02',
    title: 'Add your API keys',
    desc: 'Settings > Credentials. Add OpenAI, Perplexity, and Gmail OAuth2. Connect each to the right node.',
  },
  {
    num: '03',
    title: 'Test it',
    desc: 'Click "Execute Workflow", open the form URL, enter a topic. Check your email.',
  },
];

const N8N_API_KEYS = [
  { service: 'OpenAI', powers: 'AI brain, audio, moderation', url: 'platform.openai.com/api-keys' },
  { service: 'Perplexity', powers: 'Real-time web research', url: 'perplexity.ai/settings/api' },
  { service: 'Google OAuth2', powers: 'Gmail + Sheets', url: 'console.cloud.google.com' },
];

export default async function WorkshopResourcesPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const workshop = await findWorkshop(slug);
  if (!workshop) notFound();

  const cookieStore = await cookies();
  const unlocked =
    searchParams.unlocked === 'true' ||
    cookieStore.get(`unlocked_${slug}`)?.value === 'true' ||
    (slug === DEFAULT_WORKSHOP.slug &&
      cookieStore.get('unlocked_workshop')?.value === 'true');
  if (!unlocked) redirect(`/workshops/${slug}`);

  const files = await listWorkshopFiles(slug);
  const isN8nWorkshop = slug === DEFAULT_WORKSHOP.slug;

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ ACCESS GRANTED
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {workshop.title}
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Download the configuration files, prompts, and guides from this workshop.
          </p>
        </div>
      </section>

      {/* WhatsApp Community Invitation */}
      <section className="pt-12 px-6 max-w-3xl mx-auto">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest text-[#25d366] bg-[#25d366]/10 border border-[#25d366]/20 px-2 py-0.5 rounded">
              💬 ACTIVE COMMUNITY
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Join the Private WhatsApp Group
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Discuss AI workflows, share vibe coding experiments, and connect with other
              non-technical builders in real-time.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/D4KNtVUNHQo7ipId4yHSPO?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center bg-[#25d366] hover:bg-[#20ba5a] text-white font-semibold py-3 px-6 rounded-lg text-xs tracking-wider uppercase transition-colors shrink-0 cursor-pointer shadow-sm shadow-[#25d366]/10"
          >
            Join Chat &rarr;
          </a>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
          Download Assets
        </h2>
        {files.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 text-sm">
              Workshop files will be available here shortly. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <a
                key={file.name}
                href={`/api/download?w=${encodeURIComponent(slug)}&f=${encodeURIComponent(file.name)}`}
                className="flex items-center gap-5 premium-card p-6 no-underline hover:border-teal-accent/30 group relative overflow-hidden text-left"
              >
                <span className="text-2xl shrink-0 w-10 text-center text-slate-400 group-hover:text-teal-accent transition-colors">
                  📄
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold group-hover:text-teal-accent transition-colors tracking-wide">
                    {prettifyFilename(file.name)}
                  </p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed font-mono">
                    {file.name}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded shrink-0">
                  {fileExtension(file.name)}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {isN8nWorkshop && (
        <>
          {/* Quick Start */}
          <section className="py-12 px-6 max-w-3xl mx-auto">
            <div className="premium-card p-8 text-left relative overflow-hidden">
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
                n8n Deployment checklist
              </h3>
              <div className="space-y-4">
                {N8N_QUICK_START.map((step) => (
                  <div key={step.num} className="flex gap-4 items-start">
                    <span className="text-teal-accent font-bold text-xs font-mono shrink-0 mt-0.5">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-slate-900 text-sm font-semibold tracking-wide">
                        {step.title}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* API Keys */}
          <section className="py-4 px-6 pb-8 max-w-3xl mx-auto">
            <div className="premium-card p-8 text-left relative overflow-hidden">
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
                Required API Endpoints
              </h3>
              <div className="divide-y divide-slate-100 font-mono text-xs">
                {N8N_API_KEYS.map((key) => (
                  <div key={key.service} className="flex justify-between items-center py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-950 font-bold">{key.service}</span>
                      <span className="text-slate-400 text-[10px] hidden sm:inline">
                        : {key.powers}
                      </span>
                    </div>
                    <span className="text-teal-accent text-[10px] text-right font-medium">
                      {key.url}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Newsletter */}
      <section className="py-16 px-6 bg-slate-light border-t border-slate-200 mt-8">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <p className="text-slate-600 text-sm">
            I break down a live AI workflow like this every single week.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm
              sourceTag={`workshop-${slug}`}
              variant="standard"
              buttonText="Subscribe"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
