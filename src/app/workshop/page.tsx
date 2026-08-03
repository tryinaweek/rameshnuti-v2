import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Build Your First AI Agent | Ramesh Nuti",
  description:
    "Everything you need to recreate the research agent workflow from the April 9 workshop. Download the n8n JSON, prompts, and one-pager.",
};

const steps = [
  { label: "Form Input", color: "bg-blue-50 text-blue-800 border-blue-100" },
  { label: "AI Agent", color: "bg-indigo-50 text-indigo-800 border-indigo-100" },
  { label: "Evaluate", color: "bg-emerald-50 text-emerald-800 border-emerald-100" },
  { label: "Moderate", color: "bg-amber-50 text-amber-800 border-amber-100" },
  { label: "Switch", color: "bg-rose-50 text-rose-800 border-rose-100" },
  { label: "Audio TTS", color: "bg-sky-50 text-sky-800 border-sky-100" },
  { label: "Email", color: "bg-teal-50 text-teal-800 border-teal-100" },
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
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Signature Brand Bar */}
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ APRIL 9, 2026 WORKSHOP
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Build Your First
            <br />
            <span className="text-teal-accent">AI Agent</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            You showed up. You built it. Now take it home. Recreate the complete automated research agent workflow from today&apos;s session.
          </p>
        </div>
      </section>

      {/* What You Built */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <div className="premium-card p-8 text-left relative overflow-hidden">
          <h3 className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mb-4">
            Workflow Nodes Architecture
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <span
                  className={`${step.color} border px-3 py-1.5 rounded-md text-xs font-mono font-bold whitespace-nowrap`}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <span className="text-slate-300 text-sm font-mono">&rarr;</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4 leading-relaxed">
            A topic is input via form, Perplexity scans the web in real-time, GPT-4o synthesizes an audio script, runs a safety check, converts it to a TTS audio file, and Gmail sends the report directly to your inbox.
          </p>
        </div>
      </section>

      {/* Lead Capture Form — Substack Inline */}
      <section className="py-4 px-6 max-w-3xl mx-auto">
        <div className="premium-card p-8 text-left relative overflow-hidden">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2 font-sans">
            Unlock your workshop files
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Submit your email below to instantly access the download page containing the n8n JSON schema, prompting scripts, and the workshop cheatsheet.
          </p>
          <div className="bg-slate-light border border-slate-200 rounded-xl p-6 shadow-inner">
            <NewsletterForm sourceTag="workshop" variant="standard" buttonText="Unlock Files & Subscribe" redirectTo="/workshops/ai-agent-workshop/resources" />
          </div>
        </div>
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
            <NewsletterForm sourceTag="workshop" variant="standard" buttonText="Subscribe" />
          </div>
        </div>
      </section>
    </div>
  );
}
