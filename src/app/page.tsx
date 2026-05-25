import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Ramesh Nuti | 75+ AI Projects Shipped",
  description: "2x founder. Investor @ Svyam Ventures. Vibe coder. 75+ AI projects shipped. I'll teach you the system.",
};

export default function HomePage() {
  return (
    <div className="space-y-0 bg-white min-h-screen font-sans text-slate-900">
      
      {/* 1. HERO SECTION - Clean White with Royal Blue Accents */}
      <section className="relative py-16 md:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Proposition & Inline Signup Form */}
            <div className="md:col-span-7 space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-slate-600">
                ⚡ BUILDER &middot; INVESTOR &middot; EDUCATOR
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
                75+ AI projects shipped.
                <br />
                <span className="text-teal-accent">All vibe coded.</span>
                <br />
                <span className="text-slate-500">I&apos;ll teach you the system.</span>
              </h1>
              
              <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
                The new programming language is English. I help non-technical founders, builders, and solopreneurs design, build, and deploy real AI products without writing traditional code.
              </p>

              <NewsletterForm variant="hero" buttonText="Subscribe" placeholder="Email address" />
            </div>

            {/* Right Column: Speaking Image Framed with Thin Border */}
            <div className="md:col-span-5 relative flex justify-center md:justify-end animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="relative p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <Image
                  src="/images/hero-speaking.jpeg"
                  alt="Ramesh Nuti speaking about vibe coding and AI"
                  width={340}
                  height={425}
                  priority
                  className="rounded-xl object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                  style={{ width: 340, height: "auto" }}
                />
              </div>
            </div>
          </div>

          {/* Grayscale Brand Logos Strip */}
          <div className="border-t border-slate-100 py-8 mt-16 flex flex-wrap justify-between items-center gap-6 opacity-45 grayscale">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">SVYAM VENTURES</span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">ACTIONEDI</span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">STARTUP GRIND</span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400">REPLIT TOP 5%</span>
          </div>

        </div>
      </section>

      {/* 2. BIO SECTION - Deep Navy Blue Block */}
      <section className="bg-brand-navy text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Rounded Avatar + Text Story */}
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-white p-0.5">
                  <Image
                    src="/ramesh-nuti.jpeg"
                    alt="Ramesh Nuti avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hi, I&apos;m Ramesh Nuti.</h2>
                  <p className="text-xs text-brand-cyan font-mono tracking-wider uppercase">Founder, Investor, Vibe Coder</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
                <p>
                  I&apos;ve spent the last 20+ years navigating the intersection of software development, early-stage startups, and venture capital. 
                </p>
                <p>
                  As an active angel investor at <a href="https://svyam.co" target="_blank" rel="noopener noreferrer" className="text-brand-cyan font-bold hover:underline">Svyam Ventures</a> and director of the Frisco chapter of Startup Grind, I see hundreds of pitches. The common failure point isn&apos;t a lack of vision; it&apos;s slow execution.
                </p>
                <p>
                  <span className="text-brand-cyan font-semibold">AI is changing the velocity of development.</span> I run these workshops and release these tools to help you master &ldquo;vibe coding&rdquo;—compressing traditional engineering timelines to validate your market in days instead of months.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-block border border-white/80 hover:bg-white/10 text-white rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  More about me &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Replit Proof Widget in Dark Card */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="bg-[#121c38] border border-white/10 rounded-2xl p-4 max-w-[320px] overflow-hidden shadow-2xl">
                <div className="h-1 bg-brand-cyan w-full rounded-t-lg mb-3" />
                <Image
                  src="/images/replit-rewind.jpeg"
                  alt="Replit Rewind 2025 showing Top 5% status"
                  width={300}
                  height={300}
                  className="rounded-lg object-contain"
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="pt-4 pb-2 px-1 text-center">
                  <p className="text-white font-bold text-sm">Replit Rewind 2025</p>
                  <p className="text-brand-cyan text-[10px] font-mono mt-1 font-bold uppercase tracking-wider">
                    🏆 TOP 5% ON REPLIT (42 APPS)
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] font-mono mt-3 max-w-[280px] text-center leading-relaxed">
                *Plus 30+ more apps shipped using Cursor, Claude Code, and Lovable in 2025/2026.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OFFERINGS SECTION - Vibrant Royal Blue Block */}
      <section className="bg-brand-blue text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Heading */}
            <div className="md:col-span-5 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Three ways
                <br />
                I can help <span className="text-brand-cyan">you.</span>
              </h2>
              <p className="text-blue-100 text-sm max-w-xs leading-relaxed">
                Choose the resource that matches your current startup building goals.
              </p>
            </div>

            {/* Right Column: Three Offerings */}
            <div className="md:col-span-7 space-y-8 divide-y divide-blue-400/40 text-left">
              
              {/* Offering 01 */}
              <div className="space-y-4 pt-0">
                <div className="flex gap-4 items-baseline">
                  <span className="text-xs font-mono font-bold text-brand-cyan uppercase">01</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">The Startup Value Weekly Newsletter</h3>
                </div>
                <p className="text-blue-100 text-sm pl-8">
                  Get weekly vibe coding workflows, custom prompts, and n8n templates delivered directly to your inbox. No fluff.
                </p>
                <div className="pl-8 pt-2 max-w-md">
                  <NewsletterForm variant="navy" buttonText="Subscribe Free" placeholder="Enter your email" />
                </div>
              </div>

              {/* Offering 02 */}
              <div className="space-y-4 pt-6">
                <div className="flex gap-4 items-baseline">
                  <span className="text-xs font-mono font-bold text-brand-cyan uppercase">02</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">Build Your First AI Agent (Workshop Resources)</h3>
                </div>
                <p className="text-blue-100 text-sm pl-8">
                  The live workshop is complete. Recreate the automated research agent workflow from our Startup Grind Frisco session. Access the n8n JSON schema, prompts, and one-pager.
                </p>
                <div className="pl-8 pt-2">
                  <Link
                    href="/workshop"
                    className="inline-block border border-white/60 hover:bg-white/10 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all"
                  >
                    Access Workshop Resources &rarr;
                  </Link>
                </div>
              </div>

              {/* Offering 03 */}
              <div className="space-y-4 pt-6">
                <div className="flex gap-4 items-baseline">
                  <span className="text-xs font-mono font-bold text-brand-cyan uppercase">03</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">The Vibe Coder&apos;s OS (Book &amp; System)</h3>
                </div>
                <p className="text-blue-100 text-sm pl-8">
                  The complete play-by-play handbook. Everything I know about scaling businesses and shipping code with AI models.
                </p>
                <div className="pl-8 pt-2">
                  <Link
                    href="/courses"
                    className="inline-block border border-white/60 hover:bg-white/10 text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-all"
                  >
                    Learn More &rarr;
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. AI TOOLS SECTION - Clean light block with visually textured cards */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Featured AI Tools &amp; Resources
            </h2>
            <p className="text-slate-500 text-sm">
              Free utilities, prompt models, and assets built to help you speed up startup validation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Card 1: Steelman (Light Slate) */}
            <div className="premium-card p-6 bg-slate-light flex flex-col justify-between text-left relative overflow-hidden border border-slate-200 shadow-sm">
              <div className="space-y-4">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-brand-blue bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                  LIVE &middot; AI TOOL
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Steelman the Opposition
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Paste your startup pitch. Get the strongest arguments against it before you walk into the investor pitch room.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <Link
                  href="/tools/steelman"
                  className="text-xs font-bold text-brand-blue hover:underline"
                >
                  Try the Critic &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2: Prompting Course (Deep Dark Navy) */}
            <div className="bg-brand-navy border border-white/10 rounded-2xl p-6 flex flex-col justify-between text-left relative overflow-hidden shadow-md">
              <div className="space-y-4">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-brand-cyan bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  FOUNDERS COURSE
                </span>
                <h3 className="text-lg font-bold text-white">
                  14-Day Prompting Course
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Learn advanced prompt engineering through daily 10-minute micro-lessons. Over 100+ founders graduated.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10">
                <a
                  href="https://playwithprompts.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-cyan hover:underline"
                >
                  Start the Course &rarr;
                </a>
              </div>
            </div>

            {/* Card 3: AI Agents Library (White Card) */}
            <div className="premium-card p-6 bg-white flex flex-col justify-between text-left border border-slate-200 shadow-sm">
              <div className="space-y-4">
                <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  GPT LIBRARY
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  AI Agents Library
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Access custom GPTs built for competitive research, newsletter copywriting, and SaaS system architecture.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200">
                <a
                  href="https://ailab.svyam.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-blue hover:underline"
                >
                  Browse Agents &rarr;
                </a>
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors no-underline"
            >
              Browse All Interactive Tools &rarr;
            </Link>
          </div>

        </div>
      </section>
      
    </div>
  );
}
