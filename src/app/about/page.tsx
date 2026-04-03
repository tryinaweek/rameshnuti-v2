import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ramesh Nuti. 2x founder. Angel investor. Vibe coder. Startup community builder.",
};

export default function AboutPage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="bg-midnight py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,222,128,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col-reverse md:flex-row items-center md:items-start gap-8">
          <div className="flex-1">
            <h1 className="text-[42px] md:text-[48px] font-bold text-white leading-[1.1] tracking-tight">
              Hi, I&apos;m Ramesh
            </h1>
            <p className="text-teal-mint text-[15px] mt-4 leading-relaxed">
              I build AI apps. I invest in startups. I teach by shipping in public.
            </p>
            <div className="flex gap-1.5 flex-wrap mt-5">
              <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-teal-mint/15 text-teal-mint">
                2x founder
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-terra-400/20 text-terra-400">
                angel investor
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-violet-400/20 text-violet-400">
                vibe coder
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-teal-mint/15 text-teal-mint">
                community builder
              </span>
            </div>
          </div>
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10">
            <Image
              src="/ramesh-nuti.jpeg"
              alt="Ramesh Nuti"
              width={192}
              height={192}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6">
        {/* 2. THE OPENING */}
        <section className="py-14">
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            I joined ChatGPT 16 days after it launched. Two years and 75+
            projects later, I realized something simple and unsettling.
          </p>
          <p className="text-[28px] md:text-[32px] font-bold text-foreground leading-tight mt-14 mb-14">
            The new programming language is English.
          </p>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 3. QUICK BACKSTORY */}
        <section className="py-14 space-y-7">
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            I&apos;ve been building software for over 20 years, mostly the
            kind nobody sees. B2B infrastructure. Systems that move data
            between companies that don&apos;t speak the same language.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            That&apos;s how ActionEDI started. A B2B company I built to
            connect SMBs to Fortune 500 distributors through EDI integration.
            The unglamorous work of making supply chains actually function.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            Somewhere in there I picked up an MS in Computer Science, an MBA,
            and a growing curiosity about what happens when you put money
            behind founders instead of just advice. So I started angel investing.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            A few bets worked. Many didn&apos;t. All of them taught me faster
            than books ever could.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.7]">
            I also built the Startup Grind Frisco chapter over the last seven
            years, working with more than 1,200 founders. Watching what
            actually ships. Watching what quietly dies.
          </p>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 4. THE REAL SHIFT */}
        <section className="py-14">
          <div className="bg-midnight rounded-[14px] p-7 md:p-9 relative overflow-hidden">
            <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(194,105,74,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />

            <span className="text-[11px] font-mono font-bold tracking-[0.1em] uppercase text-teal-mint">
              The Shift
            </span>

            <h2 className="text-[22px] md:text-[24px] font-bold text-white mt-4 mb-4 leading-tight">
              The new programming language is English.
            </h2>

            <p className="text-white/60 text-[15px] leading-[1.7]">
              In 2024, something changed. I stopped waiting for engineering
              cycles and started building AI apps every weekend. No traditional
              code. Just prompts, iteration, and shipping fast.
            </p>

            <p className="text-white font-bold text-[15px] mt-5 mb-6">
              One weekend became many.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mint mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">75+ AI apps built on Replit</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mint mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">Top 5% on Replit, 42 apps verified</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">30+ more on Lovable, Cursor, Claude Code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mint mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">20+ AI agents running in production</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-terra-400 mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">A B2B company (ActionEDI) that cuts EDI costs by over 50%</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-terra-400 mt-[7px] shrink-0" />
                <p className="text-white/60 text-[14px]">25+ startup investments through Svyam Ventures</p>
              </div>
            </div>

            <p className="text-white/50 text-[14px] italic mt-6">
              Not as experiments. As real products used by real people.
            </p>
          </div>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 5. WHAT I LEARNED */}
        <section className="py-14 space-y-7">
          <h2 className="text-[22px] md:text-[24px] font-bold text-foreground leading-tight">
            What I learned from 75+ weekend builds
          </h2>

          <p className="text-[15px] text-foreground font-bold leading-[1.7]">
            Non-technical founders can now build what used to require full
            engineering teams.
          </p>

          <p className="text-[15px] text-text-secondary leading-[1.7]">
            The constraint is no longer skill. It&apos;s time, confidence, and
            knowing where to start.
          </p>

          <p className="text-[15px] text-text-secondary leading-[1.7]">
            When the interface becomes language, iteration beats credentials.
            The founders who move fastest are the ones willing to ship something
            imperfect, learn in public, and keep going.
          </p>

          <p className="text-[15px] text-foreground font-bold leading-[1.7] pt-2">
            I&apos;ve seen this play out too many times to ignore it.
          </p>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 6. WHAT I DO NOW */}
        <section className="py-14">
          <h2 className="text-[22px] md:text-[24px] font-bold text-foreground leading-tight mb-3">
            What I do now
          </h2>

          <p className="text-[17px] text-foreground font-bold leading-snug mb-3">
            My mission is to help 10,000 non-technical founders ship their
            first AI app.
          </p>

          <p className="text-[15px] text-text-secondary leading-[1.7] mb-8">
            I share the exact prompts, frameworks, and tools I use to build
            production-ready AI products. No code required. No hype. Just
            systems that work, tested by shipping.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-surface border border-[#F0F0F0] rounded-[10px] p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mint mt-[7px] shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    Teach founders to build with AI
                  </p>
                  <p className="text-[14px] text-text-secondary mt-1">
                    Courses, workshops, and frameworks for non-technical people
                    who want to ship.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-[#F0F0F0] rounded-[10px] p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-terra-400 mt-[7px] shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    Invest in early-stage startups
                  </p>
                  <p className="text-[14px] text-text-secondary mt-1">
                    25+ investments through{" "}
                    <a
                      href="https://svyamventures.com"
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
            </div>

            <div className="bg-surface border border-[#F0F0F0] rounded-[10px] p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-[7px] shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    Build AI tools for founders
                  </p>
                  <p className="text-[14px] text-text-secondary mt-1">
                    Free tools like{" "}
                    <Link
                      href="/tools/steelman"
                      className="text-teal-mint no-underline font-medium hover:underline"
                    >
                      Steelman the Opposition
                    </Link>
                    . More coming.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-[#F0F0F0] rounded-[10px] p-5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mint mt-[7px] shrink-0" />
                <div>
                  <p className="text-[15px] font-bold text-foreground">
                    Run Startup Grind Frisco
                  </p>
                  <p className="text-[14px] text-text-secondary mt-1">
                    7 years and counting.{" "}
                    <a
                      href="https://www.startupgrind.com/events/details/startup-grind-frisco-presents-build-your-first-ai-agent-a-hands-on-workshop/?code=SGAgent100H"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-mint no-underline font-medium hover:underline"
                    >
                      AI Agent Building Workshop
                    </a>
                    {" "}coming Apr 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 7. ONE LAST THING */}
        <section className="py-16 md:py-20">
          <h2 className="text-[22px] md:text-[24px] font-bold text-foreground leading-tight mb-6">
            One last thing
          </h2>

          <p className="text-[15px] text-text-secondary leading-[1.7] mb-8">
            I&apos;ve watched more than 1,200 founders up close.
          </p>

          <p className="text-[20px] md:text-[22px] font-bold text-foreground leading-snug mb-8">
            The ones who win aren&apos;t the smartest.
            <br />
            They&apos;re the ones who ship.
          </p>

          <p className="text-[20px] md:text-[22px] font-bold text-foreground">
            Your turn.
          </p>
        </section>

        <div className="h-px bg-[#E5E5E5]" />

        {/* 8. LET'S CONNECT */}
        <section className="py-14">
          <div className="bg-midnight rounded-[14px] p-8 text-center relative overflow-hidden">
            <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] bg-[radial-gradient(circle,rgba(74,222,128,0.08)_0%,transparent_70%)] pointer-events-none" />
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">
              Let&apos;s connect
            </h2>
            <p className="text-white/50 text-sm mb-5 relative z-10">
              I&apos;m most active on LinkedIn. DMs are open.
            </p>
            <a
              href="https://www.linkedin.com/in/rnuti/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terra-400 text-white px-6 py-3 rounded-lg text-sm font-bold no-underline hover:bg-terra-600 transition-colors relative z-10"
            >
              Connect on LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
