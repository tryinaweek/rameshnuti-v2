import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work with me",
  description:
    "Hands-on AI workshops for teams and free AI assessments for founders. One link for everything: workshops, assessments, and speaking.",
};

export default function WorkWithMePage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            Partner
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            How I partner
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            A few different ways, depending on what you need. Everything in{" "}
            <Link href="/lab" className="text-teal-accent font-bold no-underline hover:underline">
              the Lab
            </Link>{" "}
            was built with the same repeatable system, and the system is teachable.
          </p>
        </div>
      </section>

      {/* The two doors */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="premium-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                For teams
              </span>
              <h2 className="text-xl font-bold text-slate-900">AI workshop</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                A hands-on session where your team ships something real with AI —
                not slides about AI. Built from the system behind every project in
                the Lab, adapted to your tools and your work.
              </p>
            </div>
            <Link href="/workshop" className="btn-primary px-6 py-3 text-sm text-center no-underline">
              Explore the workshop &rarr;
            </Link>
          </div>

          <div className="premium-card p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-block bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
                For founders &amp; operators
              </span>
              <h2 className="text-xl font-bold text-slate-900">AI assessment</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                A free working session on your actual challenge — where AI fits in
                your product or operations, and what to build first. No pitch, no
                slides; you leave with a concrete next step.
              </p>
            </div>
            <Link
              href="/book-an-assessment"
              className="border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-6 py-3 text-sm font-semibold text-center no-underline transition-colors"
            >
              Book a free assessment &rarr;
            </Link>
          </div>
        </div>

        {/* Investing — deliberately not a "pitch me" form. */}
        <div className="mt-6 bg-slate-light border border-slate-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Angel investing</p>
            <p className="text-slate-600 text-xs leading-relaxed mt-1 max-w-md">
              I make a small number of early-stage investments through Svyam
              Ventures, where I&apos;ve backed 25+ companies. I&apos;m most useful
              to founders building something I understand, and I&apos;d rather have
              a real conversation than read a cold deck.
            </p>
          </div>
          <a
            href="https://svyam.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-accent text-sm font-bold no-underline hover:underline whitespace-nowrap"
          >
            Svyam Ventures &rarr;
          </a>
        </div>

        {/* Speaking */}
        <div className="mt-6 bg-slate-light border border-slate-100 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900">Speaking &amp; events</p>
            <p className="text-slate-600 text-xs leading-relaxed mt-1 max-w-md">
              I host Startup Grind Frisco and speak on building real products with
              AI. For keynotes and panels, start with an assessment call and tell
              me about your event.
            </p>
          </div>
          <Link
            href="/book-an-assessment"
            className="text-teal-accent text-sm font-bold no-underline hover:underline whitespace-nowrap"
          >
            Invite me to speak &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
