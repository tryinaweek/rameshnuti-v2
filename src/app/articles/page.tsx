import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterForm } from "@/components/NewsletterForm";
import { articles } from "@/data/articles";

import { getSubstackPosts } from "./substack";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Every article by Ramesh Nuti in one place — AI systems for founders, vibe coding, agents, and the operating systems that run real companies.",
  alternates: {
    canonical: "https://rameshnuti.com/articles",
  },
  openGraph: {
    title: "Articles | Ramesh Nuti",
    description:
      "Every article by Ramesh Nuti in one place — AI systems for founders, vibe coding, agents, and founder operations.",
    url: "https://rameshnuti.com/articles",
    siteName: "Ramesh Nuti",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ramesh Nuti Articles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | Ramesh Nuti",
    description:
      "Every article by Ramesh Nuti in one place — AI systems for founders, vibe coding, agents, and founder operations.",
    images: ["/og-image.png"],
  },
};

export const revalidate = 21600;

interface ListedArticle {
  title: string;
  url: string;
  /** Sortable ISO date. */
  date: string;
  /** What the reader sees, e.g. "Aug 1, 2026" or "March 2026". */
  dateLabel: string;
  description: string;
  onSite: boolean;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function Page() {
  const substackPosts = await getSubstackPosts();

  const onSiteArticles: ListedArticle[] = articles.map((a) => ({
    title: a.title,
    url: a.url,
    // Local articles carry display dates like "March 2026"; sort them at the
    // start of that month rather than inventing a day.
    date: `${new Date(`${a.date} 1`).toISOString().slice(0, 7)}-01`,
    dateLabel: a.date,
    description: a.description,
    onSite: true,
  }));

  const all: ListedArticle[] = [
    ...onSiteArticles,
    ...substackPosts.map((p) => ({
      title: p.title,
      url: p.url,
      date: p.date,
      dateLabel: formatDate(p.date),
      description: p.description,
      onSite: false,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero */}
      <section className="bg-brand-navy py-20 md:py-24 px-6 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10 space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Articles
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            AI systems for founders, vibe coding, and the operating systems that run real
            companies. Written weekly, delivered by the{" "}
            <a
              href="https://startupvalue.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent font-semibold hover:underline"
            >
              Ship This Week
            </a>{" "}
            newsletter.
          </p>
        </div>
      </section>

      {/* Article list */}
      <section className="py-16 md:py-20 px-6 max-w-3xl mx-auto">
        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {all.map((article) => {
            const inner = (
              <>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                  <span>{article.dateLabel}</span>
                  {article.onSite ? (
                    <span className="px-2 py-0.5 rounded-full bg-teal-accent/10 text-teal-accent font-bold tracking-wide">
                      On this site
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold tracking-wide">
                      Substack ↗
                    </span>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-teal-accent transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">{article.description}</p>
              </>
            );
            const rowClass = "group block py-7 space-y-2 no-underline";
            return article.onSite ? (
              <Link key={article.url} href={article.url} className={rowClass}>
                {inner}
              </Link>
            ) : (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
              >
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      {/* Newsletter capture */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto bg-brand-navy rounded-2xl p-8 md:p-10 text-center space-y-5">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Get the next one in your inbox
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            One 5-minute email a week — what shipped, what broke, and the exact prompts and
            systems behind it. Free.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="navy" sourceTag="articles" buttonText="Subscribe" />
          </div>
        </div>
      </section>
    </div>
  );
}
