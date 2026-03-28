import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools & Resources",
  description: "Free AI-powered tools, frameworks, and resources for founders. By Ramesh Nuti.",
};

const tools = [
  {
    slug: "steelman",
    name: "Steelman the Opposition",
    description:
      "Paste your idea. Get the strongest possible arguments against it before you walk into the room.",
    status: "live" as const,
  },
];

const upcoming = [
  {
    name: "Pitch Analyzer",
    description: "Get AI feedback on your pitch deck before you send it to investors.",
  },
  {
    name: "Market Scanner",
    description: "Find competitors, adjacent products, and market gaps in seconds.",
  },
];

const promptIngredients = [
  { num: 1, name: "TASK", desc: "Clearly outline what you want done" },
  { num: 2, name: "CONTEXT", desc: "Background info and the bigger picture" },
  { num: 3, name: "PERSONA", desc: "Have AI act as someone (board member, customer, critic)" },
  { num: 4, name: "WHY", desc: "Ask AI to explain its reasoning" },
  { num: 5, name: "LIMITS", desc: "What should AI avoid?" },
  { num: 6, name: "FORMAT", desc: "How should output look?" },
  { num: 7, name: "INTERVIEW", desc: '"Ask me questions first"' },
];

const vibeCodingFundamentals = [
  { letter: "T", name: "THINKING", desc: "Plan before you build" },
  { letter: "F", name: "FRAMEWORKS", desc: "Know which tools to use" },
  { letter: "C", name: "CHECKPOINTS", desc: "Version control (things WILL break)" },
  { letter: "D", name: "DEBUGGING", desc: "Systematically fix problems" },
  { letter: "C", name: "CONTEXT", desc: "More detail = better results" },
];

const apps = [
  {
    name: "TheHeadshotApp",
    description: "AI-powered professional headshots. 3 free headshots to start.",
    url: "https://theheadshotapp.com",
  },
  {
    name: "MovedToday",
    description: "One-button movement tracker. Intentionally minimal.",
    url: "https://apps.apple.com/us/app/moved-today/id6757989197",
  },
  {
    name: "Get Started with Replit",
    description: "Cloud-based, beginner-friendly, with built-in version control. Sign up and get $10 in free credits.",
    url: "https://replit.com/refer/ramesh-nuti",
  },
];

export default function ToolsPage() {
  return (
    <div>
      {/* Midnight Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(74,222,128,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-teal-mint text-sm font-semibold tracking-wider uppercase mb-3">
            Free. No signup required.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Tools &amp; Resources
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed">
            Free AI-powered tools, frameworks, and resources for founders. No signup required.
          </p>
        </div>
      </section>

      {/* Section 1: Interactive Tools */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-midnight mb-6">Interactive Tools</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
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
                  {tool.name}
                </h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  {tool.description}
                </p>
                <span className="inline-block mt-4 text-teal-mint text-sm font-bold">
                  Try it &rarr;
                </span>
              </Link>
            ))}
            {upcoming.map((tool) => (
              <div
                key={tool.name}
                className="bg-midnight rounded-xl p-6 opacity-70 relative overflow-hidden"
              >
                <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-0.5 w-8 bg-violet-400 rounded" />
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400 bg-violet-400/15 px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Resources */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-xl font-bold text-midnight">Resources</h2>

          {/* Presentation */}
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-teal-mint rounded" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-mint bg-teal-mint/15 px-2 py-0.5 rounded">
                Featured
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Essential AI Skills for 2026</h3>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              49 slides from my Startup Grind Frisco talk. Prompting, agents, vibe coding, and more.
            </p>
            <a
              href="https://startupvalue.substack.com/p/essential-ai-skills-for-2026-full"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-teal-mint text-midnight px-5 py-2.5 rounded-lg text-sm font-bold no-underline hover:opacity-90 transition-opacity"
            >
              Get the Full Deck &rarr;
            </a>
          </div>

          {/* AI Agents */}
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-violet-400 rounded" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400 bg-violet-400/15 px-2 py-0.5 rounded">
                20+ Agents
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">AI Agents (Steal These)</h3>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              Custom GPTs I&apos;ve built for research, content, analysis, and more. All public. Clone them, customize them, save hours.
            </p>
            <a
              href="https://ailab.svyam.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-violet-400 text-white px-5 py-2.5 rounded-lg text-sm font-bold no-underline hover:opacity-90 transition-opacity"
            >
              Browse All Agents &rarr;
            </a>
          </div>

          {/* Prompting Course */}
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(194,105,74,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-terra-400 rounded" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-terra-400 bg-terra-400/15 px-2 py-0.5 rounded">
                Free Course
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Prompting Course (14 Days)</h3>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              Learn prompting by doing. Daily exercises, real templates. 100+ founders have taken this course.
            </p>
            <a
              href="https://playwithprompts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-terra-400 text-white px-5 py-2.5 rounded-lg text-sm font-bold no-underline hover:opacity-90 transition-opacity"
            >
              Start the Course &rarr;
            </a>
          </div>

          {/* Frameworks */}
          <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.06)_0%,transparent_70%)] pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-1">Frameworks That Actually Work</h3>
            <p className="text-white/60 text-sm mb-6">
              The mental models I use every day for prompting and vibe coding.
            </p>

            <h4 className="text-sm font-bold text-teal-mint uppercase tracking-wider mb-3">
              7 Prompt Ingredients
            </h4>
            <div className="space-y-2 mb-8">
              {promptIngredients.map((item) => (
                <div key={item.num} className="flex items-start gap-3 rounded-lg bg-midnight-light p-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-teal-mint text-midnight flex items-center justify-center text-xs font-bold">
                    {item.num}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-teal-mint font-medium mt-2">
                Start with: 1, 2, 3, and 7. The secret weapon is #7.
              </p>
            </div>

            <h4 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3">
              5 Vibe Coding Fundamentals
            </h4>
            <div className="space-y-2">
              {vibeCodingFundamentals.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg bg-midnight-light p-3">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-violet-400 text-white flex items-center justify-center text-xs font-bold">
                    {item.letter}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apps */}
          <div>
            <h3 className="text-xl font-bold text-midnight mb-4">Apps I&apos;ve Built (Try Them)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {apps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-midnight rounded-xl p-5 no-underline hover:bg-midnight-light transition-colors group"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-mint transition-colors">
                    {app.name}
                  </h4>
                  <p className="text-xs text-white/60 mt-2 leading-relaxed">
                    {app.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
