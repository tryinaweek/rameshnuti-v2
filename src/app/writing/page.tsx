import Image from "next/image";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

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
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 text-left">
          <p className="text-teal-accent text-sm font-semibold tracking-wider uppercase mb-3">
            Ideas. Frameworks. Lessons.
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Writing
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-lg leading-relaxed">
            Thinking about AI, vibe coding, and what it means to build when the rules keep changing.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {articles.map((article) => (
              <a
                key={article.title}
                href={article.url}
                className="premium-card overflow-hidden no-underline block text-left group"
              >
                {article.image && (
                  <div className="relative w-full h-56 md:h-64 bg-slate-light border-b border-slate-100">
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
                        className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-auto font-mono">
                      {article.date}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {article.description}
                  </p>
                  <span className="inline-block mt-3 text-teal-accent text-sm font-bold group-hover:underline">
                    Read article &rarr;
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-slate-light border-t border-slate-100">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">More articles coming</h2>
          <p className="text-slate-500 text-sm mb-6">
            Subscribe to get them first.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="standard" buttonText="Subscribe" />
          </div>
        </div>
      </section>
    </div>
  );
}
