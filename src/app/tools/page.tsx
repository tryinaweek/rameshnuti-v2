import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  description: "Free AI-powered tools for founders. Built by Ramesh Nuti.",
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
            Tools
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed">
            AI-powered tools for founders. Use them free. Share them on LinkedIn.
          </p>
        </div>
      </section>

      {/* Live Tools */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
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
                <h2 className="text-lg font-bold text-white group-hover:text-teal-mint transition-colors">
                  {tool.name}
                </h2>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  {tool.description}
                </p>
                <span className="inline-block mt-4 text-teal-mint text-sm font-bold">
                  Try it &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-midnight mb-6">Coming Soon</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
    </div>
  );
}
