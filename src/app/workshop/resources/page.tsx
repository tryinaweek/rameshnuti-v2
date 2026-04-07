import type { Metadata } from "next";
import Link from "next/link";
import { list } from "@vercel/blob";

export const metadata: Metadata = {
  title: "Workshop Resources — Build Your First AI Agent",
  description:
    "Download the n8n workflow JSON, agent prompt, evaluation prompt, and workshop one-pager.",
};

const downloadMeta: Record<string, { title: string; desc: string; icon: string; tag: string; order: number }> = {
  "research_workflow_n8n.json": {
    title: "n8n Workflow JSON",
    desc: "Import directly into n8n. All 16 nodes pre-configured.",
    icon: "{ }",
    tag: "IMPORT READY",
    order: 0,
  },
  "AI_Agent_Workshop_OnePager.pdf": {
    title: "Workshop One-Pager",
    desc: "Quick reference with the flow diagram, API keys, and mental model.",
    icon: "doc",
    tag: "PDF",
    order: 1,
  },
  "agent_prompt.txt": {
    title: "Agent System Prompt",
    desc: "The complete research agent prompt. Copy and paste into your AI Agent node.",
    icon: "brain",
    tag: "TXT",
    order: 2,
  },
  "evaluation_prompt.txt": {
    title: "Evaluation Prompt",
    desc: "Quality scoring prompt for the Evaluation1 node.",
    icon: "chart",
    tag: "TXT",
    order: 3,
  },
};

const quickStart = [
  {
    num: "01",
    title: "Import the JSON",
    desc: 'In n8n, click the ... menu at top-right, select "Import from File", choose the JSON.',
  },
  {
    num: "02",
    title: "Add your API keys",
    desc: "Settings > Credentials. Add OpenAI, Perplexity, and Gmail OAuth2. Connect each to the right node.",
  },
  {
    num: "03",
    title: "Test it",
    desc: 'Click "Execute Workflow", open the form URL, enter a topic. Check your email.',
  },
];

const apiKeys = [
  { service: "OpenAI", powers: "AI brain, audio, moderation", url: "platform.openai.com/api-keys" },
  { service: "Perplexity", powers: "Real-time web research", url: "perplexity.ai/settings/api" },
  { service: "Google OAuth2", powers: "Gmail + Sheets", url: "console.cloud.google.com" },
];

export const revalidate = 60; // re-fetch blob list every 60s

export default async function WorkshopResourcesPage() {
  let downloads: { title: string; desc: string; icon: string; url: string; tag: string; order: number }[] = [];

  try {
    const { blobs } = await list({ prefix: "workshop/" });
    downloads = blobs
      .map((blob) => {
        const filename = blob.pathname.replace("workshop/", "");
        const meta = downloadMeta[filename];
        if (!meta) return null;
        return { ...meta, url: blob.url };
      })
      .filter(Boolean) as typeof downloads;
    downloads.sort((a, b) => a.order - b.order);
  } catch {
    // Blob store not configured yet — show empty state
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-emerald-500/12 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
            You&apos;re in
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Workshop Resources
          </h1>
          <p className="text-white/50 text-base mt-4 max-w-xl leading-relaxed">
            Download everything below. You have full access to all the files from
            the &ldquo;Build Your First AI Agent&rdquo; workshop.
          </p>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-midnight mb-6">Downloads</h2>
          {downloads.length === 0 ? (
            <div className="bg-midnight rounded-xl p-8 text-center">
              <p className="text-white/50 text-sm">
                Workshop files will be available here shortly. Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloads.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-midnight rounded-xl p-5 no-underline hover:bg-midnight-light transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.08)_0%,transparent_70%)] pointer-events-none" />
                  <span className="text-2xl shrink-0 w-10 text-center text-white/60">
                    {item.icon === "doc" ? "\u{1F4C4}" : item.icon === "brain" ? "\u{1F9E0}" : item.icon === "chart" ? "\u{1F4CA}" : item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold group-hover:text-teal-mint transition-colors">
                      {item.title}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-white/30 bg-white/5 px-2.5 py-1 rounded shrink-0">
                    {item.tag}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-5">
              Get running in 3 steps
            </h3>
            <div className="space-y-4">
              {quickStart.map((step) => (
                <div key={step.num} className="flex gap-4 items-start">
                  <span className="text-violet-400 font-bold text-sm font-mono shrink-0 mt-0.5">
                    {step.num}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">{step.title}</p>
                    <p className="text-white/50 text-sm mt-0.5 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Keys */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-5">
              API Keys you need
            </h3>
            <div className="divide-y divide-white/5">
              {apiKeys.map((key) => (
                <div
                  key={key.service}
                  className="flex justify-between items-center py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white text-sm font-semibold">
                      {key.service}
                    </span>
                    <span className="text-white/30 text-xs">{key.powers}</span>
                  </div>
                  <span className="text-violet-400 text-xs font-mono">
                    {key.url}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 px-6 bg-surface">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-text-secondary text-sm mb-4">
            I break down one AI workflow like this every week.
          </p>
          <Link
            href="https://startupvalue.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-terra-400 text-terra-400 px-7 py-3 rounded-lg font-bold text-sm no-underline hover:bg-terra-400 hover:text-white transition-colors"
          >
            Subscribe to the newsletter &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
