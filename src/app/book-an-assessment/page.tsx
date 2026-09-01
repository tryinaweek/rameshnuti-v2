import type { Metadata } from "next";
import { AssessmentForm } from "./AssessmentForm";

/**
 * RETIRED — kept only so existing links and bookmarks don't 404.
 *
 * The free assessment offer was withdrawn: a standing promise of free working
 * sessions is a service commitment. Nothing on the site links here any more,
 * and it is noindexed so search engines drop it rather than keep sending
 * people to an offer that no longer stands. The form and /api/book-assessment
 * still work, and past submissions in Blob are untouched.
 *
 * Decide later whether to redirect this to /work-with-me or delete it.
 */
export const metadata: Metadata = {
  title: "AI Workflow Assessment | Ramesh Nuti",
  description: "This page is no longer part of the site.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://rameshnuti.com/work-with-me" },
};

const steps = [
  {
    num: "01",
    title: "Request your call",
    desc: "Fill out the form below. I'll personally reply within 24 hours to schedule a 30-minute call.",
  },
  {
    num: "02",
    title: "The assessment call",
    desc: "We walk through your day-to-day operations together and find the workflows eating your time — the repetitive, manual, error-prone stuff.",
  },
  {
    num: "03",
    title: "Your workflow map",
    desc: "You get a prioritized map of 2–3 automation opportunities, with the hours and dollars each one would save you. Yours to keep, free.",
  },
  {
    num: "04",
    title: "Pick one, I lead the build",
    desc: "Pick the highest-impact workflow and I personally lead and build the fix — a working AI automation powered by the same agent stack behind my 75+ shipped projects. Days, not weeks.",
  },
];

const credibility = [
  { stat: "75+", label: "AI projects shipped" },
  { stat: "2x", label: "Founder (ActionEDI, supply-chain AI)" },
  { stat: "25+", label: "Investments @ Svyam Ventures" },
  { stat: "1,200+", label: "Founders @ Startup Grind Frisco" },
];

export default function BookAssessmentPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Signature Brand Bar */}
      <div className="h-[3px] w-full bg-sig-bar" />

      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4 text-center">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ Free AI Workflow Assessment
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Find the workflow that&apos;s costing you
            <br className="hidden md:block" />{" "}
            <span className="text-teal-accent">5+ hours a week.</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            In one free 30-minute call, I&apos;ll assess your business workflows and show
            you exactly where AI can win back your time — no jargon, no obligation, no
            slide decks.
          </p>
        </div>
      </section>

      {/* Credibility strip */}
      <section className="py-8 px-6 border-b border-slate-100">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {credibility.map((c) => (
            <div key={c.label} className="space-y-1">
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{c.stat}</p>
              <p className="text-[11px] text-slate-500 leading-snug">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 text-center">
          How it works
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {steps.map((step) => (
            <div key={step.num} className="premium-card p-6 text-left space-y-2">
              <span className="text-teal-accent font-bold text-xs font-mono">{step.num}</span>
              <p className="text-slate-900 text-sm font-bold tracking-wide">{step.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="request" className="py-4 px-6 pb-16 max-w-xl mx-auto">
        <div className="premium-card p-8 relative overflow-hidden">
          <div className="space-y-2 mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Request your free assessment
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              The first assessment is completely free. If you like the workflow map,
              we can talk about building the fixes together.
            </p>
          </div>
          <AssessmentForm />
        </div>
      </section>

      {/* Why free */}
      <section className="py-14 px-6 bg-slate-light border-t border-slate-200">
        <div className="max-w-xl mx-auto text-center space-y-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Why is this free?
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Simple: I&apos;ve shipped 75+ AI projects, and the best way to prove AI can
            transform your business is to show you — on your own workflows. If the
            workflow map saves you time, some of you will have me lead and build the
            fixes — using the same AI leverage I&apos;ll be setting up for you.
            That&apos;s the whole model.
          </p>
        </div>
      </section>
    </div>
  );
}
