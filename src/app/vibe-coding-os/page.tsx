import type { Metadata } from "next";
import Link from "next/link";

import { FirstEditionForm } from "@/components/FirstEditionForm";

const TITLE = "Vibe Coding OS | A book for founders using AI";
const DESCRIPTION =
  "A practical book for non-technical founders who want to use AI to move from idea to evidence faster. Coming January 2027.";
const URL = "https://rameshnuti.com/vibe-coding-os";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vibe Coding OS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

/** What the Circle is, said plainly. No promises I can't keep yet. */
const CIRCLE = [
  "Early material as chapters become readable.",
  "The open questions, while they're still open.",
  "A way to tell me where I'm wrong before it's printed.",
];

export default function VibeCodingOsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Vibe Coding OS",
    description: DESCRIPTION,
    url: URL,
    author: { "@type": "Person", name: "Ramesh Nuti", url: "https://rameshnuti.com" },
    inLanguage: "en",
    // Announced for January 2027; no ISBN or publisher confirmed yet.
    datePublished: "2027-01",
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="border-b border-slate-100 bg-slate-light px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-5">
          <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
            Coming January 2027
          </span>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
            Vibe Coding OS
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
            A practical book for non-technical founders who want to use AI to move from idea
            to evidence faster.
          </p>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-500">
            It draws from two decades of building companies, dozens of AI experiments, and
            hundreds of conversations with founders.
          </p>
        </div>
      </section>

      {/* The question */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
            The question the book is built around
          </h2>
          <p className="text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl">
            How much distance can we remove between an idea and knowing whether it works?
          </p>
          <div className="max-w-2xl space-y-4 pt-2 text-[15px] leading-relaxed text-slate-600">
            <p>
              For most of my career the honest answer was months. You raised money, hired
              engineers, built the thing, and only then found out whether anyone wanted it.
            </p>
            <p>
              That distance is collapsing. Not to zero, and not evenly, but far enough that
              the old sequence no longer makes sense for a lot of ideas. This book is my
              attempt to write down what actually works now, including the parts that
              didn&apos;t.
            </p>
          </div>
        </div>
      </section>

      {/* The Circle */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              The First Edition Circle
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Not a mailing list. A small group of founders, builders, investors, and
              practitioners who want to follow the book as it&apos;s written, read early
              material, and tell me what&apos;s missing.
            </p>
            <ul className="space-y-2.5 pt-1">
              {CIRCLE.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="pt-1 text-xs leading-relaxed text-slate-400">
              It&apos;s early. I&apos;m not promising a review copy or a launch discount,
              because I don&apos;t know yet what I can offer.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="premium-card p-7">
              <FirstEditionForm />
            </div>
          </div>
        </div>
      </section>

      {/* Where the material comes from */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Where the material comes from
          </h2>
          <p className="max-w-2xl text-[15px] leading-relaxed text-slate-600">
            The book isn&apos;t being written from theory. Most of it comes out of work
            that&apos;s already public.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link href="/lab" className="premium-card p-5 no-underline group">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                The Lab
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Every product I&apos;ve shipped, and what each one taught me.
              </p>
            </Link>
            {/* Build With Me ships unlinked until the first teardown is
                written. Restore its card here to surface it. */}
            <Link href="/gpts" className="premium-card p-5 no-underline group">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                GPT Garden
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Custom GPTs built for real work, and what they taught me.
              </p>
            </Link>
            <Link href="/articles" className="premium-card p-5 no-underline group">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                Articles
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                Longer thinking, published as I work it out.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
