"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NewsletterForm } from "@/components/NewsletterForm";

interface ArticleLayoutProps {
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  children: React.ReactNode;
}

export function ArticleLayout({
  title,
  description,
  date,
  category,
  readTime,
  children,
}: ArticleLayoutProps) {
  const [shareUrl, setShareUrl] = useState("");
  const [encodedTitle, setEncodedTitle] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(encodeURIComponent(window.location.href));
      setEncodedTitle(encodeURIComponent(title));
    }
  }, [title]);

  return (
    <article className="min-h-screen bg-white text-slate-900 font-sans py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back navigation */}
        <div className="mb-10">
          <Link
            href="/writing"
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-teal-accent transition-colors gap-2"
          >
            &larr; Back to writing
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article Body */}
          <div className="lg:col-span-8 space-y-8 text-left">
            <div>
              <div className="flex items-center gap-3 text-xs font-mono font-semibold tracking-wider text-slate-500 uppercase mb-4">
                <span>{date}</span>
                <span>&bull;</span>
                <span className="text-teal-accent">{category}</span>
                <span>&bull;</span>
                <span>{readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
              {description && (
                <p className="mt-4 text-lg md:text-xl text-slate-500 leading-relaxed font-normal">
                  {description}
                </p>
              )}
            </div>

            {/* Divider line */}
            <div className="h-px bg-slate-100 w-full" />

            {/* Article content block */}
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-accent prose-a:no-underline hover:prose-a:underline">
              {children}
            </div>
          </div>

          {/* Sticky Funnel Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
            {/* Newsletter form */}
            <div className="p-6 md:p-8 bg-slate-light border border-slate-100 rounded-2xl text-left space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Subscribe to the Newsletter
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Join 1,000+ readers who start their week with a 5-minute essay on building startups and vibe coding.
              </p>
              <div className="pt-2">
                <NewsletterForm variant="standard" buttonText="Subscribe" />
              </div>
            </div>

            {/* Social Sharing */}
            <div className="p-6 md:p-8 border border-slate-100 rounded-2xl text-left space-y-4">
              <h4 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                Share this Article
              </h4>
              <div className="flex gap-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-500 transition-colors"
                  aria-label="Share on X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-500 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
