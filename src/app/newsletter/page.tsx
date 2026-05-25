import type { Metadata } from "next";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "The Weekend Builder Newsletter",
  description: "Learn to build and ship software using AI. Weekly vibe coding tutorials, prompt blueprints, and automation workflows for non-technical founders.",
};

export default function NewsletterPage() {
  return (
    <div className="bg-slate-light min-h-screen text-slate-900 font-sans flex flex-col justify-center py-20 px-6">
      <div className="max-w-xl mx-auto w-full bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center space-y-8 animate-fade-up">
        {/* Header Badge */}
        <div>
          <span className="inline-block bg-teal-550/10 border border-slate-200 text-teal-accent px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            THE WEEKEND BUILDER
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Build and ship software using AI.
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            I share vibe coding tutorials, prompt blueprints, and automation workflows for non-technical founders weekly.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-slate-light/60 border border-slate-100/80 rounded-2xl p-6 md:p-8 space-y-4">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
            Get the next blueprint this Saturday
          </p>
          <NewsletterForm 
            variant="standard" 
            buttonText="Subscribe Free" 
            placeholder="Enter your email" 
            redirectTo="/workshop/resources"
          />
          <p className="text-[11px] text-slate-400 leading-normal">
            By subscribing, you will also get immediate, free access to all workshop downloads, slides, and cheat sheets.
          </p>
        </div>

        {/* Benefits Checklist */}
        <div className="text-left space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">
            What you will get:
          </h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="text-teal-accent font-bold mt-0.5">&rarr;</span>
              <span><strong>Vibe Coding Stack</strong>: The exact setup I use to ship 75+ projects without writing code.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-teal-accent font-bold mt-0.5">&rarr;</span>
              <span><strong>Prompt Blueprints</strong>: Copy-pasteable frameworks to get board-level and operational depth from AI.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-teal-accent font-bold mt-0.5">&rarr;</span>
              <span><strong>Automation Workflows</strong>: Real-world playbooks to replace manual overhead using AI agents.</span>
            </li>
          </ul>
        </div>

        {/* Creator Bio Block */}
        <div className="pt-6 border-t border-slate-100 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-50 relative">
            <Image
              src="/ramesh-nuti.jpeg"
              alt="Ramesh Nuti"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Ramesh Nuti</h4>
            <p className="text-[11px] text-slate-500 leading-snug">
              2x founder, investor at Svyam Ventures, and builder of 75+ AI projects. Helping 10,000 founders ship their first AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
