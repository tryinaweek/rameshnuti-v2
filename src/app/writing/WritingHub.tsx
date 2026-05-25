"use client";

import { useState } from "react";
import Link from "next/link";
import { articles } from "@/data/articles";

const categories = [
  {
    id: "ai-startups",
    name: "AI & Startups",
    description: "Finding ideas, building defensible moats, and the new rules of starting up.",
    slugs: ["how-to-start-a-startup-in-the-ai-era"],
  },
  {
    id: "vibe-coding",
    name: "Vibe Coding",
    description: "Developing code in the age of generative AI and prompt-driven engineering.",
    slugs: [], // Empty for now, shows "Coming soon"
  },
  {
    id: "growth-audience",
    name: "Growth & Audience",
    description: "Building in public, content systems, and scaling your personal distribution.",
    slugs: [], // Empty for now
  },
  {
    id: "personal-systems",
    name: "Personal Systems",
    description: "Productivity hacks, time leverage, and solopreneur operational models.",
    slugs: [], // Empty for now
  },
];

export default function WritingHub() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter articles based on search query
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isSearchActive = searchQuery.length > 0;

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Search Hero Section */}
      <section className="bg-brand-navy py-20 md:py-24 px-6 border-b border-slate-800 text-center relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto border-b-2 border-slate-700 pb-3 group focus-within:border-teal-accent transition-colors">
            {/* Search Icon */}
            <svg
              className="w-8 h-8 text-slate-400 group-focus-within:text-teal-accent transition-colors mr-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for an article.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-2xl md:text-4xl font-bold text-white placeholder-slate-500 border-none outline-none w-full focus:ring-0"
            />
          </div>

          <div>
            <button
              onClick={() => {}}
              className="bg-white hover:bg-slate-100 text-brand-navy font-bold px-8 py-3 rounded-full text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Article Topics Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-left mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Article Topics
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Explore articles, guides, and mental frameworks grouped by domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            // Find articles belonging to this category
            const categoryArticles = filteredArticles.filter(
              (art) => art.category === category.name
            );

            // Determine if this category has matches when search is active
            const hasArticles = categoryArticles.length > 0;

            // If search is active and there are no matching articles in this category, we can hide it
            if (isSearchActive && !hasArticles) {
              return null;
            }

            return (
              <div
                key={category.id}
                className="premium-card bg-white border border-slate-200 rounded-2xl flex flex-col text-left overflow-hidden"
              >
                {/* Category Header */}
                <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {category.name}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <span className="text-teal-accent font-bold text-xl">&rsaquo;</span>
                </div>

                {/* Article List */}
                <div className="flex-1 divide-y divide-slate-100 px-6 md:px-8">
                  {hasArticles ? (
                    categoryArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={article.url}
                        className="flex justify-between items-center py-5 group/item text-slate-700 hover:text-teal-accent transition-colors"
                      >
                        <div className="pr-4 space-y-1">
                          <span className="block text-sm font-semibold leading-snug">
                            {article.title}
                          </span>
                          <span className="block text-[11px] font-mono text-slate-400">
                            {article.date} &bull; {article.readTime}
                          </span>
                        </div>
                        <span className="text-slate-300 group-hover/item:text-teal-accent group-hover/item:translate-x-1 transition-all font-bold text-lg select-none">
                          &rarr;
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs font-mono">
                      {isSearchActive ? "No matching articles found." : "More insights coming soon."}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* If no search results at all */}
        {isSearchActive && filteredArticles.length === 0 && (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <p className="text-lg font-semibold">No articles found matching &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-sm text-slate-400">Try searching for keywords like &ldquo;startup&rdquo;, &ldquo;AI&rdquo;, or &ldquo;strategy&rdquo;.</p>
          </div>
        )}
      </section>
    </div>
  );
}
