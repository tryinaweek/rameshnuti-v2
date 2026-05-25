import type { Metadata } from "next";
import { list } from "@vercel/blob";
import { NewsletterForm } from "@/components/NewsletterForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Workshop Resources | Ramesh Nuti",
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

export default async function WorkshopResourcesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const isUnlockedQuery = searchParams.unlocked === "true";

  const cookieStore = await cookies();
  const unlockedCookie = cookieStore.get("unlocked_workshop")?.value === "true";

  if (!unlockedCookie && !isUnlockedQuery) {
    redirect("/workshop");
  }

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
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Signature Brand Bar */}
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ ACCESS GRANTED
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Workshop Resources
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Download the configuration files, prompting models, and structural schematics from the workshop.
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
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Join the Private WhatsApp Group</h3>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Discuss AI workflows, share vibe coding experiments, and connect with other non-technical builders in real-time.
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
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">Download Assets</h2>
        {downloads.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <p className="text-slate-500 text-sm">
              Workshop files will be available here shortly. Check back soon.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {downloads.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 premium-card p-6 no-underline hover:border-teal-accent/30 group relative overflow-hidden text-left"
              >
                <span className="text-2xl shrink-0 w-10 text-center text-slate-400 group-hover:text-teal-accent transition-colors">
                  {item.icon === "doc" ? "\u{1F4C4}" : item.icon === "brain" ? "\u{1F9E0}" : item.icon === "chart" ? "\u{1F4CA}" : item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 text-sm font-semibold group-hover:text-teal-accent transition-colors tracking-wide">
                    {item.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded shrink-0">
                  {item.tag}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Quick Start */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <div className="premium-card p-8 text-left relative overflow-hidden">
          <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
            n8n Deployment checklist
          </h3>
          <div className="space-y-4">
            {quickStart.map((step) => (
              <div key={step.num} className="flex gap-4 items-start">
                <span className="text-teal-accent font-bold text-xs font-mono shrink-0 mt-0.5">
                  {step.num}
                </span>
                <div>
                  <p className="text-slate-900 text-sm font-semibold tracking-wide">{step.title}</p>
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
      <section className="py-4 px-6 pb-20 max-w-3xl mx-auto">
        <div className="premium-card p-8 text-left relative overflow-hidden">
          <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-5">
            Required API Endpoints
          </h3>
          <div className="divide-y divide-slate-100 font-mono text-xs">
            {apiKeys.map((key) => (
              <div
                key={key.service}
                className="flex justify-between items-center py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-950 font-bold">
                    {key.service}
                  </span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">: {key.powers}</span>
                </div>
                <span className="text-teal-accent text-[10px] text-right font-medium">
                  {key.url}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Substack Newsletter */}
      <section className="py-16 px-6 bg-slate-light border-t border-slate-200">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <p className="text-slate-600 text-sm">
            I break down a live AI workflow like this every single week.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="standard" buttonText="Subscribe" />
          </div>
        </div>
      </section>
    </div>
  );
}
