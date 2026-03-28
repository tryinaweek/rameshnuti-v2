import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ramesh Nuti",
  description: "75+ AI projects shipped. All vibe coded. I'll teach you the system.",
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-speaking.jpeg')" }}
        />
        <div className="absolute inset-0 bg-midnight/75" />
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <p className="text-teal-mint text-sm font-semibold tracking-wider uppercase mb-4">
            Builder. Investor. Educator.
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight max-w-2xl">
            75+ AI projects shipped.{" "}
            <span className="text-teal-mint">All vibe coded.</span>{" "}
            <span className="text-terra-400">I&apos;ll teach you the system.</span>
          </h1>
          <p className="text-white/50 text-lg mt-6 max-w-xl leading-relaxed">
            The new programming language is English. I help non-technical
            founders ship their first AI product without writing a single line
            of code.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/courses"
              className="bg-terra-400 text-white px-6 py-3 rounded-lg font-bold text-sm no-underline hover:bg-terra-600 transition-colors"
            >
              Explore Courses
            </Link>
            <Link
              href="/tools"
              className="border-2 border-terra-400 text-terra-400 px-6 py-3 rounded-lg font-bold text-sm no-underline hover:bg-terra-400 hover:text-white transition-colors"
            >
              Try Free Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Credibility - two column: stats + Replit proof */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left: Stats 2x2 */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-midnight rounded-xl p-5 text-center">
                  <p className="text-teal-mint text-3xl font-bold">75+</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">AI Projects Shipped</p>
                  <p className="text-violet-400 text-[10px] mt-2 font-mono">Top 5% on Replit &middot; 42 apps</p>
                </div>
                <div className="bg-midnight rounded-xl p-5 text-center">
                  <p className="text-terra-400 text-3xl font-bold">25+</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">Startup Investments</p>
                  <p className="text-white/30 text-[10px] mt-2">via Svyam Ventures</p>
                </div>
                <div className="bg-midnight rounded-xl p-5 text-center">
                  <p className="text-teal-mint text-3xl font-bold">7</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">Years Startup Grind</p>
                  <p className="text-white/30 text-[10px] mt-2">Director, Frisco Chapter</p>
                </div>
                <div className="bg-midnight rounded-xl p-5 text-center">
                  <p className="text-violet-400 text-3xl font-bold">20+</p>
                  <p className="text-white/50 text-xs mt-1 font-medium">Years in Tech</p>
                  <p className="text-white/30 text-[10px] mt-2">MS in Computer Science</p>
                </div>
              </div>
              <p className="text-text-muted text-xs mt-4 text-center md:text-left">
                Plus 30+ more apps built on Lovable, Cursor, Claude Code, and others.
              </p>
            </div>

            {/* Right: Replit Rewind */}
            <div className="shrink-0">
              <Image
                src="/images/replit-rewind.jpeg"
                alt="Replit Rewind 2025 — 42 apps built, Top 5% worldwide"
                width={300}
                height={0}
                className="rounded-xl shadow-lg shadow-black/20 border border-white/10"
                style={{ width: 300, height: "auto" }}
              />
              <p className="text-text-muted text-[11px] mt-3 font-mono tracking-wide text-center">
                Replit Rewind 2025 &mdash; Top 5% worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-midnight mb-2">Free Tools</h2>
          <p className="text-text-secondary text-sm mb-8">
            AI-powered tools for founders. Use them free. Share them on LinkedIn.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/tools/steelman"
              className="bg-midnight rounded-xl p-6 no-underline hover:bg-midnight-light transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 w-8 bg-teal-mint rounded" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-mint bg-teal-mint/15 px-2 py-0.5 rounded">
                  Live
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-mint transition-colors">
                Steelman the Opposition
              </h3>
              <p className="text-white/60 text-sm mt-2 leading-relaxed">
                Paste your idea. Get the strongest possible arguments against it
                before you walk into the room.
              </p>
            </Link>
            <div className="bg-midnight rounded-xl p-6 opacity-70 relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 w-8 bg-violet-400 rounded" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400 bg-violet-400/15 px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">More tools on the way</h3>
              <p className="text-white/60 text-sm mt-2">
                AI tools for pitch prep, market research, and founder decision-making.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-midnight mb-2">Upcoming</h2>
          <p className="text-text-secondary text-sm mb-8">
            Workshops, events, and things in the works.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(194,105,74,0.2)_0%,transparent_70%)] pointer-events-none" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-terra-400">
                Apr-Jun 2026
              </span>
              <h3 className="text-lg font-bold text-white mt-3">
                Startup Grind Frisco Workshops
              </h3>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                AI agent building. Vibe coding your MVP. AI workflow automation.
                Paid workshops for serious builders.
              </p>
            </div>
            <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
                Coming Soon
              </span>
              <h3 className="text-lg font-bold text-white mt-3">
                The Vibe Coder&apos;s OS
              </h3>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                The book. Everything I know about building with AI, distilled
                into a system anyone can follow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-midnight mb-2">Stay in the loop</h2>
          <p className="text-text-secondary text-sm mb-6">
            Weekly insights on vibe coding, AI tools, and building without engineers.
          </p>
          <iframe
            src="https://rameshnuti.substack.com/embed"
            width="100%"
            height="150"
            className="border-0 rounded-lg bg-white"
            title="Newsletter signup"
          />
        </div>
      </section>
    </div>
  );
}
