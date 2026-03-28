import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toolkit",
  description: "The AI Builder's Toolkit. Frameworks, agents, courses, and apps from Ramesh Nuti.",
};

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

export default function ToolkitPage() {
  return (
    <div>
      {/* Midnight Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-violet-400 text-sm font-semibold tracking-wider uppercase mb-3">
            Frameworks. Agents. Apps.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            The AI Builder&apos;s Toolkit
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg mx-auto leading-relaxed">
            The exact tools, frameworks, and resources I use to build AI products every week.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {/* Presentation */}
        <div className="bg-midnight rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.1)_0%,transparent_70%)] pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-teal-mint rounded" />
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-mint bg-teal-mint/15 px-2 py-0.5 rounded">
              Featured
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Essential AI Skills for 2026</h2>
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
          <h2 className="text-xl font-bold text-white">AI Agents (Steal These)</h2>
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
          <h2 className="text-xl font-bold text-white">Prompting Course (14 Days)</h2>
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
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-xl font-bold text-midnight mb-1">Frameworks That Actually Work</h2>
          <p className="text-text-secondary text-sm mb-6">
            The mental models I use every day for prompting and vibe coding.
          </p>

          <h3 className="text-sm font-bold text-teal-mint uppercase tracking-wider mb-3">
            7 Prompt Ingredients
          </h3>
          <div className="space-y-2 mb-8">
            {promptIngredients.map((item) => (
              <div key={item.num} className="flex items-start gap-3 rounded-lg bg-white p-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-teal-mint text-midnight flex items-center justify-center text-xs font-bold">
                  {item.num}
                </span>
                <div>
                  <p className="text-sm font-bold text-midnight">{item.name}</p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-teal-mint font-medium mt-2">
              Start with: 1, 2, 3, and 7. The secret weapon is #7.
            </p>
          </div>

          <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3">
            5 Vibe Coding Fundamentals
          </h3>
          <div className="space-y-2">
            {vibeCodingFundamentals.map((item, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-white p-3">
                <span className="w-7 h-7 shrink-0 rounded-full bg-violet-400 text-white flex items-center justify-center text-xs font-bold">
                  {item.letter}
                </span>
                <div>
                  <p className="text-sm font-bold text-midnight">{item.name}</p>
                  <p className="text-xs text-text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Apps */}
        <section>
          <h2 className="text-xl font-bold text-midnight mb-4">Apps I&apos;ve Built (Try Them)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {apps.map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-midnight rounded-xl p-5 no-underline hover:bg-midnight-light transition-colors group"
              >
                <h3 className="text-sm font-bold text-white group-hover:text-teal-mint transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-white/60 mt-2 leading-relaxed">
                  {app.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
