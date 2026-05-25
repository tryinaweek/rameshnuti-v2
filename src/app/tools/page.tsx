import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Tools & Resources | Ramesh Nuti",
  description: "Free AI-powered tools, frameworks, and resources for founders. By Ramesh Nuti.",
};

const tools = [
  {
    slug: "steelman",
    name: "Steelman the Opposition",
    description:
      "Paste your startup idea. Get the strongest possible arguments against it before you walk into the investor pitch room.",
    status: "live" as const,
  },
  {
    slug: "spacex-ipo-simulator",
    name: "SpaceX IPO Investment Simulator",
    description:
      "Model a SpaceX IPO investment against the S&P 500. See why the ~110x revenue multiple, not the rockets, is the number that decides your return.",
    status: "live" as const,
  },
  {
    slug: "pitch-analyzer",
    name: "Pitch Analyzer & Stress Tester",
    description:
      "Stress-test your pitch deck outline and GTM strategy against the Svyam Ventures investor checklist and real-world operational friction.",
    status: "live" as const,
  },
];

const upcoming = [
  {
    name: "Market Scanner",
    description: "Map out your competitors, identify adjacent markets, and spot gaps in seconds.",
  },
];

const promptIngredients = [
  { num: 1, name: "TASK", desc: "Clearly outline what you want done" },
  { num: 2, name: "CONTEXT", desc: "Provide background info and specify the ultimate business objective" },
  { num: 3, name: "PERSONA", desc: "Have the AI act as a specific expert (e.g. board member, lead skeptic, direct customer)" },
  { num: 4, name: "WHY", desc: "Ask the AI to explain its reasoning step-by-step" },
  { num: 5, name: "LIMITS", desc: "Explicitly list what the AI should avoid or ignore" },
  { num: 6, name: "FORMAT", desc: "Specify exactly how the output should be structured (markdown, JSON, bullets)" },
  { num: 7, name: "INTERVIEW", desc: 'Force the AI to ask you questions to gather context before generating the result' },
];

const vibeCodingFundamentals = [
  { letter: "T", name: "THINKING", desc: "Write out your architectural plan in markdown before writing code" },
  { letter: "F", name: "FRAMEWORKS", desc: "Choose the right boilerplate tools to move fast without bloat" },
  { letter: "C", name: "CHECKPOINTS", desc: "Commit early and often — things will break when code is generated" },
  { letter: "D", name: "DEBUGGING", desc: "Approach error logs systematically, pasting them directly back to the LLM" },
  { letter: "C", name: "CONTEXT", desc: "Your results are only as good as the system prompt and codebase details you feed in" },
];

const apps = [
  {
    name: "TheHeadshotApp",
    description: "AI-powered professional headshots. 3 free headshots to get started.",
    url: "https://theheadshotapp.com",
  },
  {
    name: "MovedToday",
    description: "One-button physical movement tracker. Intentionally minimal.",
    url: "https://apps.apple.com/us/app/moved-today/id6757989197",
  },
  {
    name: "Get Started with Replit",
    description: "Cloud-based editor with built-in version control. Use refer link for $10 free credit.",
    url: "https://replit.com/refer/ramesh-nuti",
  },
];

export default function ToolsPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero Header - Light slate styled banner */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ FREE &middot; NO SIGNUP REQUIRED
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Tools &amp; Resources
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            AI-powered web utilities, cheat sheets, and downloadable frameworks built to help founders ship products and automate workflows.
          </p>
        </div>
      </section>

      {/* Section 1: Interactive Utilities */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
          Interactive Utilities
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="premium-card p-8 flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-teal-accent bg-teal-50 border border-teal-100 px-2.5 py-1 rounded">
                    LIVE &middot; ACCELERATOR
                  </span>
                  <span className="text-slate-300 group-hover:text-teal-accent transition-colors text-lg">&rarr;</span>
                </div>
                
                <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-accent transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-accent">
                <span>Run the analysis</span>
                <span className="font-mono">tools/{tool.slug}/ &rarr;</span>
              </div>
            </Link>
          ))}
          
          {upcoming.map((tool) => (
            <div
              key={tool.name}
              className="premium-card p-8 flex flex-col justify-between text-left opacity-70"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                    COMING SOON
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  {tool.name}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>In Development</span>
                <span className="font-mono">pipeline/ &middot;&middot;&middot;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Resources & Assets */}
      <section className="py-20 px-6 bg-slate-light border-y border-slate-100">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center md:text-left">
            Resources &amp; Frameworks
          </h2>

          <div className="space-y-6">
            {/* Presentation Slide deck */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-accent md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-[3px] md:h-auto" />
              
              <div className="space-y-2 max-w-xl">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-teal-accent bg-teal-550/10 border border-teal-100 px-2.5 py-1 rounded">
                  FEATURED PRESENTATION &middot; 49 SLIDES
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Essential AI Skills for 2026</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  The complete slide deck from my Startup Grind Dallas keynotes. Prompt structures, n8n agent architectures, and vibe coding pipelines.
                </p>
              </div>
              <a
                href="https://startupvalue.substack.com/p/essential-ai-skills-for-2026-full"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3.5 px-6 text-sm text-center w-full md:w-auto inline-block whitespace-nowrap"
              >
                Get the Deck &rarr;
              </a>
            </div>

            {/* AI Agents Library */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-accent md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-[3px] md:h-auto" />
              
              <div className="space-y-2 max-w-xl">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-teal-accent bg-teal-550/10 border border-teal-100 px-2.5 py-1 rounded">
                  GPT LIBRARY &middot; 20+ AGENTS
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">AI Agents (Steal These)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Access custom GPTs I built for competitive research, newsletter copywriting, startup valuation, and system design. Public &amp; cloneable.
                </p>
              </div>
              <a
                href="https://ailab.svyam.co"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3.5 px-6 text-sm text-center w-full md:w-auto inline-block whitespace-nowrap"
              >
                Browse All Agents &rarr;
              </a>
            </div>

            {/* Prompting Course */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-accent md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-[3px] md:h-auto" />
              
              <div className="space-y-2 max-w-xl">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-teal-accent bg-teal-50 border border-teal-100 px-2.5 py-1 rounded">
                  FOUNDERS COURSE &middot; 14 DAYS
                </span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">Prompting Course (14 Days)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Learn advanced prompt engineering through daily 10-minute micro-lessons. Currently hosted on PlayWithPrompts. Over 100+ founders graduated.
                </p>
              </div>
              <a
                href="https://playwithprompts.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3.5 px-6 text-sm text-center w-full md:w-auto inline-block whitespace-nowrap"
              >
                Start the Course &rarr;
              </a>
            </div>
          </div>

          {/* Cheat Sheets & Framework Details - Clean Editorial Design */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">My Internal Cheat Sheets</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                The mental models and parameters I feed into LLMs to build software and analyze startup business models.
              </p>
            </div>

            {/* Prompt Ingredients */}
            <div className="space-y-6">
              <h4 className="text-xs font-mono font-bold text-teal-accent uppercase tracking-widest border-b border-slate-100 pb-2">
                &mdash; 7 Prompt Ingredients
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {promptIngredients.map((item) => (
                  <div key={item.num} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-light">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-teal-50 border border-teal-100 text-teal-accent flex items-center justify-center text-xs font-mono font-bold">
                      {item.num}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 tracking-wide">{item.name}</p>
                      <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-teal-accent/90 italic font-mono pt-1">
                Pro-tip: Start with 1 (Task), 2 (Context), 3 (Persona) and 7 (Interview). The secret is letting AI ask you questions first.
              </p>
            </div>

            {/* Vibe Coding Fundamentals */}
            <div className="space-y-6">
              <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                &mdash; 5 Vibe Coding Fundamentals
              </h4>
              <div className="grid sm:grid-cols-2 gap-4">
                {vibeCodingFundamentals.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-light">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-mono font-bold">
                      {item.letter}
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900 tracking-wide">{item.name}</p>
                      <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipped Apps Showcase */}
          <div className="space-y-6 pt-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Apps I Shipped Without Code</h3>
              <p className="text-slate-500 text-sm">
                Built natively on cloud developer setups. Fully functional.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {apps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-card p-6 no-underline block text-left"
                >
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                    {app.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed h-12 overflow-hidden">
                    {app.description}
                  </p>
                  <span className="inline-block mt-4 text-[10px] font-mono font-bold tracking-wider text-teal-accent uppercase group-hover:underline">
                    View Project &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Get new utilities first</h2>
          <p className="text-slate-500 text-sm">
            I post new tools, prompt cheat sheets, and automation setups every week on Substack. Join 1,000+ creators.
          </p>
          
          <NewsletterForm variant="standard" buttonText="Subscribe Free" placeholder="Enter your email" />
        </div>
      </section>
    </div>
  );
}
