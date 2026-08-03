import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ramesh Nuti. 2x founder. Angel investor. Vibe coder. Startup community builder.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      
      {/* 1. HERO SECTION (Slate Light Backdrop) */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left space-y-6">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-teal-accent">
              ⚡ Builder &middot; Investor &middot; Educator
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Hi, I&apos;m Ramesh.
            </h1>
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
              I build AI products, invest in early-stage startups, and teach non-technical founders how to ship by building in public.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600">
                2x founder
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600">
                angel investor
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600">
                vibe coder
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600">
                community leader
              </span>
            </div>
          </div>
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-white p-1.5">
            <Image
              src="/ramesh-nuti.jpeg"
              alt="Ramesh Nuti"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* 2. THE THESIS (White Background) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-left space-y-6">
          <span className="text-xs font-mono font-bold tracking-widest text-teal-accent uppercase block">
            &mdash; The Core Thesis
          </span>
          <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
            I joined ChatGPT 16 days after it launched. Two years and 75+ projects later, I realized something simple and unsettling:
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight pt-2">
            The new programming language is English.
          </h2>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            The constraint is no longer writing syntax; it&apos;s having the confidence to define architecture, prompt correctly, and iterate at the speed of thought.
          </p>
        </div>
      </section>

      {/* 3. QUICK BACKSTORY (Slate Light Background - Two Column Editorial) */}
      <section className="py-20 px-6 bg-slate-light border-y border-slate-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Story */}
          <div className="md:col-span-7 text-left space-y-6">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              How I got here
            </h3>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              20 years of building and investing.
            </h2>
            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
              <p>
                I&apos;ve been building software for over 20 years, mostly the infrastructure that operates behind the scenes. 
                That curiosity led me to build <strong>ActionEDI</strong>, a supply-chain integration company that cuts B2B EDI costs by over 50% for SMBs working with Fortune 500 distributors.
              </p>
              <p>
                With an MS in Computer Science and an NYU Stern MBA, I started angel investing to back early-stage founders. Through 
                <strong> Svyam Ventures</strong>, I&apos;ve made 25+ early-stage investments, helping pre-revenue builders scale operations.
              </p>
              <p>
                I also built the <strong>Startup Grind Frisco</strong> chapter, which I have led for the last seven years, bringing together over 1,200 founders to help them design and deploy their businesses.
              </p>
            </div>
          </div>

          {/* Right Column: Career Snapshot Card */}
          <div className="md:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 text-left">
              <h4 className="text-xs font-mono font-bold tracking-widest text-teal-accent uppercase border-b border-slate-100 pb-2">
                Career Snapshot
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 font-mono">B2B SAAS</p>
                  <p className="text-sm font-bold text-slate-900">Founder &amp; Architect, ActionEDI</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">VENTURE CAPITAL</p>
                  <p className="text-sm font-bold text-slate-900">Managing Partner, Svyam Ventures</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">COMMUNITY</p>
                  <p className="text-sm font-bold text-slate-900">Director, Startup Grind Frisco (1,200+ members)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono">CREDENTIALS</p>
                  <p className="text-sm font-bold text-slate-900">MS in Computer Science &middot; NYU Stern MBA</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. THE VIBE CODING SHIFT (White Background) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-left max-w-2xl space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-teal-accent uppercase block">
              &mdash; The Vibe Coding Era
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Vibe coding beats traditional engineering cycles.
            </h2>
            <p className="text-slate-600 text-[15px] leading-relaxed">
              In 2024, I stopped waiting for traditional development cycles. I started using LLMs, Replit, Cursor, and Lovable to build real products in weekend sprints. One build became many, proving that speed-to-market beats legacy coding overhead.
            </p>
          </div>

          {/* Grid of Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-light border border-slate-100 rounded-2xl text-left space-y-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">75+</p>
              <p className="text-xs text-slate-500 font-medium">AI Projects Shipped</p>
            </div>
            <div className="p-6 bg-slate-light border border-slate-100 rounded-2xl text-left space-y-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">Top 5%</p>
              <p className="text-xs text-slate-500 font-medium">Verified on Replit</p>
            </div>
            <div className="p-6 bg-slate-light border border-slate-100 rounded-2xl text-left space-y-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">20+</p>
              <p className="text-xs text-slate-500 font-medium">Agents in Production</p>
            </div>
            <div className="p-6 bg-slate-light border border-slate-100 rounded-2xl text-left space-y-2">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">25+</p>
              <p className="text-xs text-slate-500 font-medium">Startup Investments</p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. WHAT I DO NOW (Slate Light Background - Cards Grid) */}
      <section className="py-20 px-6 bg-slate-light border-y border-slate-100">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-left space-y-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              Current Focus
            </h3>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              My mission: Help 10,000 founders build with AI.
            </h2>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              I compile and share the exact prompting models, n8n agent workflows, and dev setups I use to ship production apps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Offering 1 */}
            <div className="premium-card p-8 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-teal-accent bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                  EDUCATION
                </span>
                <h3 className="text-xl font-bold text-slate-900">Teach Founders to Build</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  I write cohort materials, run workshops, and share guides to help non-technical operators design, run, and scale their own AI engines.
                </p>
              </div>
            </div>

            {/* Offering 2 */}
            <div className="premium-card p-8 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-teal-accent bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                  INVESTMENTS
                </span>
                <h3 className="text-xl font-bold text-slate-900">Invest in Early-Stage Teams</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  I provide capital and strategic advice to early-stage startups through{" "}
                  <a
                    href="https://svyam.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-accent font-bold hover:underline"
                  >
                    Svyam Ventures
                  </a>
                  , backing founders who build functional solutions.
                </p>
              </div>
            </div>

            {/* Offering 3 */}
            <div className="premium-card p-8 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-teal-accent bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                  PRODUCTIVITY
                </span>
                <h3 className="text-xl font-bold text-slate-900">Develop AI Utilities</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  I build free, single-purpose interactive tools like the{" "}
                  <Link
                    href="/tools/steelman"
                    className="text-teal-accent font-bold hover:underline"
                  >
                    Steelman Analyzer
                  </Link>{" "}
                  and the SpaceX Simulator to expose market assumptions.
                </p>
              </div>
            </div>

            {/* Offering 4 */}
            <div className="premium-card p-8 flex flex-col justify-between text-left">
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-teal-accent bg-blue-50 border border-blue-100 px-2.5 py-1 rounded">
                  COMMUNITY
                </span>
                <h3 className="text-xl font-bold text-slate-900">Run Startup Grind Frisco</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  I lead local events and workshops to foster the local ecosystem. Check out the completed{" "}
                  <Link
                    href="/workshop"
                    className="text-teal-accent font-bold hover:underline"
                  >
                    AI Agent Workshop Resources
                  </Link>{" "}
                  from our recent session.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. LET'S CONNECT (White Background - Premium Split Layout) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-slate-light border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm grid md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 text-left space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Let&apos;s build together.
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              I share vibe coding frameworks and early investment theses weekly. Join 1,000+ builders or get in touch on LinkedIn.
            </p>
            <div className="pt-2">
              <a
                href="https://www.linkedin.com/in/rnuti/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3 text-sm inline-block shadow-sm"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>

          <div className="md:col-span-6 w-full text-center space-y-4 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-left">
              Join The Weekend Builder list:
            </p>
            <NewsletterForm sourceTag="newsletter-about" variant="standard" buttonText="Subscribe Free" placeholder="Enter your email" />
          </div>

        </div>
      </section>
      
    </div>
  );
}
