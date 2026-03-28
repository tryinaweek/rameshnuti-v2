import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Ramesh Nuti. 2x founder. Angel investor. Vibe coder. Startup community builder.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,222,128,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            About Ramesh
          </h1>
          <div className="flex gap-1.5 flex-wrap mt-4">
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-teal-mint/15 text-teal-mint">
              2x founder
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-terra-400/20 text-terra-400">
              angel investor
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-violet-400/20 text-violet-400">
              vibe coder
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-[3px] rounded-[5px] bg-teal-mint/15 text-teal-mint">
              community builder
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="prose prose-sm max-w-none">
          <p className="text-text-secondary leading-relaxed">
            I&apos;ve spent the last 14+ years in tech. MS in Computer Science.
            Built a B2B company (ActionEDI) that connects SMBs to Fortune 500
            distributors through EDI integration. Directed Startup Grind
            Frisco for 7 years, hosting hundreds of events for founders.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Along the way, I&apos;ve made 25+ angel investments through Svyam
            Ventures, backing pre-revenue founders building real things.
          </p>
          <p className="text-text-secondary leading-relaxed">
            But the thing I&apos;m most excited about right now is vibe coding.
          </p>
        </div>

        {/* Vibe coding section */}
        <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
            The Shift
          </span>
          <h2 className="text-xl font-bold text-white mt-3 mb-3">
            The new programming language is English.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            I&apos;ve shipped 75+ AI projects without writing traditional code.
            Top 5% on Replit with 42 apps. 30+ more built on Lovable, Cursor,
            Claude Code, and others. Every single one was vibe coded.
          </p>
          <p className="text-white/50 text-sm leading-relaxed mt-3">
            That&apos;s what I teach. Not programming. Not theory. The actual
            system I use to go from idea to shipped product in hours, not months.
          </p>
        </div>

        {/* What I do now */}
        <div>
          <h2 className="text-xl font-bold text-midnight mb-4">What I do now</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
              <div className="w-2 h-2 rounded-full bg-teal-mint mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-midnight">Teach founders to build with AI</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Courses, workshops, and frameworks for non-technical people who want to ship.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
              <div className="w-2 h-2 rounded-full bg-terra-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-midnight">Invest in early-stage startups</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  25+ investments through{" "}
                  <a
                    href="https://svyam.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-mint no-underline font-medium hover:underline"
                  >
                    Svyam Ventures
                  </a>
                  . Pre-revenue founders building real things.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
              <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-midnight">Build AI tools for founders</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  Free tools like Steelman the Opposition. More coming.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-surface p-4">
              <div className="w-2 h-2 rounded-full bg-teal-mint mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-midnight">Run Startup Grind Frisco</p>
                <p className="text-xs text-text-secondary mt-0.5">
                  7 years and counting. Paid workshops coming Apr-Jun 2026: AI agents, vibe coding MVPs, workflow automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connect */}
        <div className="bg-surface rounded-xl p-6 text-center">
          <h2 className="text-lg font-bold text-midnight mb-2">Let&apos;s connect</h2>
          <p className="text-text-secondary text-sm mb-4">
            I&apos;m most active on LinkedIn. DMs are open.
          </p>
          <a
            href="https://www.linkedin.com/in/rameshnuti/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal-mint text-midnight px-6 py-2.5 rounded-lg text-sm font-bold no-underline hover:opacity-90 transition-opacity"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
