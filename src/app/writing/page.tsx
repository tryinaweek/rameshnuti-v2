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
    url: "/writing/how-to-start-a-startup-in-the-ai-era",
    image: "/images/article-ai-era.jpg",
    tags: ["AI", "Startups"],
  },
];

export default function WritingPage() {
  return (
    <div>
      {/* Midnight Hero */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(194,105,74,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-terra-400 text-sm font-semibold tracking-wider uppercase mb-3">
            Ideas. Frameworks. Lessons.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Writing
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed">
            Thinking about AI, vibe coding, and what it means to build when the rules keep changing.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {articles.map((article) => (
              <a
                key={article.title}
                href={article.url}
                className="block bg-midnight rounded-xl overflow-hidden no-underline hover:bg-midnight-light transition-colors group"
              >
                {article.image && (
                  <div className="relative w-full h-56 md:h-64 bg-midnight-light">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400 bg-violet-400/15 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-white/30 ml-auto">
                      {article.date}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white group-hover:text-teal-mint transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    {article.description}
                  </p>
                  <span className="inline-block mt-3 text-teal-mint text-sm font-bold">
                    Read article &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-surface">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-midnight mb-2">More articles coming</h2>
          <p className="text-text-secondary text-sm mb-6">
            Subscribe to get them first.
          </p>
          <iframe
            src="https://startupvalue.substack.com/embed"
            width="100%"
            height="150"
            className="border-0 rounded-lg bg-white max-w-md mx-auto"
            title="Newsletter signup"
          />
        </div>
      </section>
    </div>
  );
}
