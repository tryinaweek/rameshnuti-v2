import type { Metadata } from "next";
import Image from "next/image";

import { FirstEditionForm } from "@/components/FirstEditionForm";
import { ARC_LIMIT, arcsRemaining } from "@/lib/waitlist";

// Re-read the advance-copy count at most once a minute. A successful signup
// also marks this page stale (see /api/waitlist), so the next visit is fresh.
export const revalidate = 60;

const BOOK = "The Vibe Coder's OS";
const SUBTITLE = "The Non-Technical Founder's Guide to Building Real Products with AI";
const TITLE = `${BOOK} | A book by Ramesh Nuti`;
const DESCRIPTION =
  "A practical guide for non-technical founders who want to build real products with AI. Join the Launch Circle and get the book before launch day.";
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BOOK }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

/** The five stages the book follows, in order. */
const STAGES = [
  { name: "Idea", text: "Choose what deserves to exist." },
  { name: "Prompt", text: "Plan hard before you build fast." },
  { name: "Build", text: "Make one true thing work." },
  { name: "Deploy", text: "Building got easy. Production didn't." },
  { name: "Ship", text: "Put it in front of people, and decide." },
];

/** Editorial previews of the book's questions: enough to trust, not the whole argument. */
const PREVIEWS = [
  {
    q: "Is the old estimate still true?",
    a: "Some ideas remain untouched because of assumptions about time, cost, or complexity: estimates made years ago, under different tools. Which of those assumptions are worth testing again?",
  },
  {
    q: "What is the smallest thing you could try?",
    a: "You may not need the complete product to learn something valuable. A focused experiment can tell you whether an idea deserves more of your attention, often in days, not months.",
  },
  {
    q: "Does it work, or just look convincing?",
    a: "An impressive demo is a starting point, not an answer. What evidence would show that it actually helps someone?",
  },
  {
    q: "Where should you move carefully?",
    a: "An experiment for yourself and a tool other people depend on carry different consequences. How do you decide when speed helps and when more checking matters?",
  },
];

const FAQ = [
  {
    q: "Do I need to know how to code?",
    a: "No. The core ideas (choosing a problem, running a small experiment, judging what the results actually tell you) don't require a programming background, and vibe coding itself lowers the barrier to trying things. Real projects can still involve technical learning or help from someone experienced, and the book is honest about where that line shows up.",
  },
  {
    q: "Is this only for founders?",
    a: "It is written for non-technical founders and business owners who understand a problem better than anyone. If you are a developer, the parts on judgment, testing and production are still for you.",
  },
  {
    q: "Is this a coding manual or a book about how to approach building?",
    a: "A book about how to approach building, in seven parts. You won't find syntax references or tool tutorials. You'll find a way of thinking about where to start, how to build with AI, how to test your assumptions, and how to improve through evidence.",
  },
  {
    q: "What will I receive when I sign up?",
    a: `Launch news, and an email the moment the book is on Amazon. The first ${ARC_LIMIT} people in the Launch Circle also get the finished book as an advance copy before launch day. Read it early, and if you'd like, share an honest review once it's out.`,
  },
];

const AUDIENCE = [
  "Non-technical founders with an idea they've been carrying for months or years",
  "Business owners who understand a problem better than anyone, and have always depended on someone else to build the solution",
  "Anyone who has ever said “I just need a technical cofounder”",
];

export default async function VibeCodingOsPage() {
  const remaining = await arcsRemaining();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: BOOK,
    alternativeHeadline: SUBTITLE,
    description: DESCRIPTION,
    url: URL,
    author: { "@type": "Person", name: "Ramesh Nuti", url: "https://rameshnuti.com" },
    inLanguage: "en",
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white font-sans text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* 1: Hero */}
      <section className="border-b border-slate-100 bg-slate-light px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-12 md:gap-12">
          <div className="space-y-5 md:col-span-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
              An upcoming book by Ramesh Nuti
            </p>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-5xl">
                The Vibe Coder&apos;s OS
              </h1>
              <p className="max-w-xl text-lg font-semibold leading-snug text-slate-700 md:text-xl">
                The Non-Technical Founder&apos;s Guide to Building Real Products with AI
              </p>
            </div>
            <p className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
              That idea you keep coming back to? What if you could build it?
            </p>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              For founders and business owners who are done waiting for a developer, and
              ready to build.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="premium-card overflow-hidden">
              <div className="px-7 py-7">
                <FirstEditionForm remaining={remaining} limit={ARC_LIMIT} showCounter />
                <p className="mt-5 border-t border-slate-100 pt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Coming soon on Amazon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2: Sound familiar? */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Sound familiar?
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            &ldquo;I have the idea. I just need a technical cofounder.&rdquo; I have heard
            that sentence more than any other in twenty years of building companies and
            backing founders. It used to be true. It isn&apos;t anymore.
          </p>
        </div>
      </section>

      {/* 3: The proof */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Four months became two weeks
          </h2>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            In January 2026, a customer called me on a Friday afternoon to tell me our
            platform wasn&apos;t good enough. My team estimated four months to fix it. With
            AI, it was done, tested and live in two weeks. That week changed how I think
            about who gets to build. This book is everything I learned.
          </p>
        </div>
      </section>

      {/* 4: What's inside */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              What&apos;s inside
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              Thirty chapters in seven parts, following the way I actually build.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STAGES.map((stage, i) => (
              <li key={stage.name} className="premium-card p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                  {stage.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{stage.text}</p>
              </li>
            ))}
          </ol>
          <p className="max-w-3xl text-[15px] leading-relaxed text-slate-600">
            Every chapter has a real story from my journey, a prompt you can copy, and
            something to try in 10 minutes, 1 hour or 48 hours.
          </p>
        </div>
      </section>

      {/* The book's questions (kept as they were) */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            When building gets easier, what matters more?
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PREVIEWS.map((p) => (
              <div key={p.q} className="premium-card p-6">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  &ldquo;{p.q}&rdquo;
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5: Questions worth answering now */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Questions worth answering now
          </h2>
          <div className="space-y-7">
            {FAQ.map((item) => (
              <div key={item.q} className="space-y-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  {item.q}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6: Who it's for */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Who this book is for
          </h2>
          <ul className="space-y-3">
            {AUDIENCE.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-[15px] leading-relaxed text-slate-600"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-accent"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="text-[15px] font-semibold leading-relaxed text-slate-800">
            If you are a developer, the parts on judgment, testing and production are
            still for you.
          </p>
        </div>
      </section>

      {/* 7: The Launch Circle */}
      <section id="join" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl space-y-10">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Join the Launch Circle
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="premium-card p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
                You get
              </p>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-600">
                <li>The finished book as an advance copy, before launch day.</li>
                <li>A thank-you at launch.</li>
              </ul>
            </div>
            <div className="premium-card p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
                I ask
              </p>
              <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-slate-600">
                <li>Read it.</li>
                <li>Leave an honest review in launch week.</li>
                <li>Share it once if it helped you.</li>
              </ul>
            </div>
          </div>
          <div className="premium-card mx-auto max-w-md p-7 text-left">
            <FirstEditionForm remaining={remaining} limit={ARC_LIMIT} showCounter />
          </div>
        </div>
      </section>

      {/* 8: About the author */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <Image
                src="/ramesh-nuti.jpeg"
                alt="Ramesh Nuti"
                width={480}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-4 md:col-span-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              About the author
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              I started my career at IBM Research and spent fourteen years building a
              cybersecurity company through to its exit. Today I run a supply chain
              software company, back early founders through Svyam Ventures, and lead
              Startup Grind Frisco, which began with twenty-seven people in a hotel
              meeting room in 2019 and now has more than 1,200 founders. I have built
              more than seventy-five projects with AI, and in 2025 I was in the top 5% of
              builders on Replit.
            </p>
          </div>
        </div>
      </section>

      {/* 9: Final call to action */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            What would you build if you knew where to start?
          </h2>
          <div className="premium-card mx-auto max-w-md p-7 text-left">
            <FirstEditionForm remaining={remaining} limit={ARC_LIMIT} />
          </div>
        </div>
      </section>
    </div>
  );
}
