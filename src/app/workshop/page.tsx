import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build Your First AI Agent — Workshop Resources",
  description:
    "Everything you need to recreate the research agent workflow from the April 9 workshop. Download the n8n JSON, prompts, and one-pager.",
};

const steps = [
  { label: "Form Input", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { label: "AI Agent", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { label: "Evaluate", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { label: "Moderate", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { label: "Switch", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { label: "Audio TTS", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { label: "Email", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
];

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

export default function WorkshopPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block bg-violet-500/12 text-violet-400 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
            April 9, 2026 Workshop
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Build Your First
            <br />
            AI Agent
          </h1>
          <p className="text-white/50 text-base mt-4 max-w-xl leading-relaxed">
            You showed up. You built it. Now take it home. Everything you need to
            recreate the research agent workflow from today&apos;s session.
          </p>
        </div>
      </section>

      {/* What You Built */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_70%)] pointer-events-none" />
            <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-4">
              What you built
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <span
                    className={`${step.color} border px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap`}
                  >
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="text-white/20 text-sm">&rarr;</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-white/40 text-sm mt-4 leading-relaxed">
              A topic goes in, Perplexity researches it, GPT-4o writes an
              audio-ready summary, it gets safety-checked, converted to speech,
              and emailed to you. Fully automated.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture Form — GHL Embed */}
      <section className="py-4 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-midnight rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(194,105,74,0.15)_0%,transparent_70%)] pointer-events-none" />
            <h2 className="text-xl font-bold text-white mb-2 relative z-10 tracking-tight">
              Grab your workshop files
            </h2>
            <p className="text-white/50 text-sm mb-6 relative z-10 leading-relaxed">
              Drop your email and the downloads unlock instantly. I&apos;ll send
              you one follow-up with bonus resources and workflow extensions. No
              spam. Unsubscribe anytime.
            </p>
            <div className="relative z-10 bg-white/5 rounded-lg overflow-hidden">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/6TytisY2jvYTnQLCEj0n"
                style={{ width: "100%", height: 400, border: "none" }}
                id="inline-6TytisY2jvYTnQLCEj0n"
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Grab StartupGrind workshop files."
                data-height="undefined"
                data-layout-iframe-id="inline-6TytisY2jvYTnQLCEj0n"
                data-form-id="6TytisY2jvYTnQLCEj0n"
                title="Grab StartupGrind workshop files."
              />
            </div>
            <Script
              src="https://link.msgsndr.com/js/form_embed.js"
              strategy="lazyOnload"
            />
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 px-6">
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
      <section className="py-4 px-6 pb-12">
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
