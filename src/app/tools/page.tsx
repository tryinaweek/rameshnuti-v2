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
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-midnight mb-2">Tools</h1>
      <p className="text-text-secondary text-sm mb-10">
        Free AI-powered tools for founders. No signup required.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-6 no-underline hover:border-teal-mint transition-colors group"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-teal-mint rounded" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-mint">
                Live
              </span>
            </div>
            <h2 className="text-lg font-bold text-midnight group-hover:text-teal-mint transition-colors">
              {tool.name}
            </h2>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold text-midnight mb-4">Coming Soon</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {upcoming.map((tool) => (
          <div
            key={tool.name}
            className="bg-white border border-gray-100 rounded-xl p-6 opacity-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-violet-400 rounded" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
                Coming Soon
              </span>
            </div>
            <h3 className="text-lg font-bold text-midnight">{tool.name}</h3>
            <p className="text-text-secondary text-sm mt-2">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
