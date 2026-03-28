import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Articles on AI, vibe coding, and building as a non-technical founder.",
};

const articles = [
  {
    title: "How to Start a Startup in the AI Era",
    description:
      "The playbook has changed. Here's what non-technical founders need to know about building with AI in 2026.",
    date: "March 2026",
    url: "https://rameshnuti.com/how-to-start-ai-startup.html",
    image: "/images/article-ai-era.jpg",
    tags: ["AI", "Startups"],
  },
];

export default function WritingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-midnight mb-2">Writing</h1>
      <p className="text-text-secondary text-sm mb-10">
        Thinking about AI, vibe coding, and what it means to build when the rules keep changing.
      </p>

      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.title}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border border-gray-100 rounded-xl overflow-hidden no-underline hover:border-teal-mint transition-colors group"
          >
            {article.image && (
              <div className="relative w-full h-48 md:h-56">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400 bg-violet-50 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] text-text-muted ml-auto">
                {article.date}
              </span>
            </div>
            <h2 className="text-lg font-bold text-midnight group-hover:text-teal-mint transition-colors">
              {article.title}
            </h2>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              {article.description}
            </p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-text-muted text-sm">
          More articles coming. Subscribe to get them first.
        </p>
        <iframe
          src="https://rameshnuti.substack.com/embed"
          width="100%"
          height="150"
          className="border-0 rounded-lg bg-white mt-4 max-w-md mx-auto"
          title="Newsletter signup"
        />
      </div>
    </div>
  );
}
