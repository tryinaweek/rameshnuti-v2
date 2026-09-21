import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FirstEditionForm } from "@/components/FirstEditionForm";

const TITLE = "Vibe Coding OS | An upcoming book by Ramesh Nuti";
const DESCRIPTION =
  "That idea you keep coming back to — what if you could build it? Vibe Coding OS explores how to choose a starting point, build with AI, and learn what deserves your next step.";
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

/** Places a reader might already have an idea worth exploring. */
const IDEA_EXAMPLES = [
  {
    label: "At work",
    text: "The Monday report you assemble by hand, copying numbers between three systems that refuse to talk to each other.",
  },
  {
    label: "While studying",
    text: "The concept you'd understand in five minutes if you could drag a slider and watch it change, instead of rereading the chapter.",
  },
  {
    label: "As a creator or freelancer",
    text: "The same ten questions every new client asks — answered by a small tool with your name on it, instead of another long email.",
  },
  {
    label: "In a small business",
    text: "The order that arrives by email, gets retyped into a spreadsheet, and then retyped again into the invoice.",
  },
  {
    label: "For a side project or startup",
    text: "The idea you'd pitch tomorrow if you could show a working demo instead of a slide that describes one.",
  },
];

/** Editorial previews of the book's questions — enough to trust, not the whole argument. */
const PREVIEWS = [
  {
    q: "Is the old estimate still true?",
    a: "Some ideas remain untouched because of assumptions about time, cost, or complexity — estimates made years ago, under different tools. Which of those assumptions are worth testing again?",
  },
  {
    q: "What is the smallest thing you could try?",
    a: "You may not need the complete product to learn something valuable. A focused experiment can tell you whether an idea deserves more of your attention — often in days, not months.",
  },
  {
    q: "Does it work — or just look convincing?",
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
    a: "No. The core ideas — choosing a problem, running a small experiment, judging what the results actually tell you — don't require a programming background, and vibe coding itself lowers the barrier to trying things. Real projects can still involve technical learning or help from someone experienced, and the book is honest about where that line shows up.",
  },
  {
    q: "Is this only for founders?",
    a: "No. The lessons come from founder experience, because that's the material I have — companies built, experiments run, hundreds of conversations. But the thinking applies to anyone with a problem they understand and something they want to try: professionals, students, creators, freelancers, small-business owners, and developers curious about building with AI.",
  },
  {
    q: "Is this a coding manual or a book about how to approach building?",
    a: "A book about how to approach building. You won't find syntax references or tool tutorials. You'll find a way of thinking about where to start, how to build with AI, how to test your assumptions, and how to improve through evidence.",
  },
  {
    q: "What will I receive when I sign up?",
    a: "Progress updates while the book is being written, and launch news when it's ready. As chapters become readable, I plan to share early material with the Circle and ask what's missing.",
  },
  {
    q: "When is the book coming out?",
    a: "It's announced for January 2027. Publication details will be shared by email as they firm up.",
  },
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

      {/* 1 — Hero */}
      <section className="border-b border-slate-100 bg-slate-light px-6 py-14 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-12 md:gap-12">
          <div className="space-y-5 md:col-span-7">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
              Vibe Coding OS &middot; An upcoming book by Ramesh Nuti
            </p>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-5xl">
              That idea you keep coming back to? What if you could build it?
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              A tool that makes your work easier. A side project you want to try. A
              solution to a problem you understand better than anyone. AI is opening new
              ways to turn those ideas into something you can test.
            </p>
            <p className="max-w-xl text-[15px] leading-relaxed text-slate-500">
              Vibe Coding OS explores how to choose a starting point, build with AI, and
              learn what deserves your next step. Written for people who don&apos;t write
              code &mdash; and useful to plenty who do.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="premium-card overflow-hidden">
              {/* Typographic treatment — not the final cover. */}
              <div className="space-y-2 border-b border-slate-100 bg-white px-7 pb-6 pt-7 text-left">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Coming January 2027
                </p>
                <p className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
                  Vibe Coding
                  <span className="text-teal-accent"> OS</span>
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Ramesh Nuti
                </p>
              </div>
              <div className="px-7 py-6">
                <p className="mb-4 text-sm font-semibold leading-snug text-slate-800">
                  Join the First Edition Circle for book updates and launch news.
                </p>
                <FirstEditionForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Recognize your idea */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              You might already know what you want to build.
            </h2>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Start with something you keep noticing: a task that takes too long, a
              workaround everyone tolerates, or an idea you have never quite found a way
              to test. You do not need to be starting a company to have a useful problem
              worth exploring.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IDEA_EXAMPLES.map((item) => (
              <div key={item.label} className="premium-card p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-teal-accent">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
            <div className="flex items-center p-5">
              <p className="text-sm leading-relaxed text-slate-400">
                Different starting points, one shared move: taking an idea seriously
                enough to explore it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — What vibe coding means */}
      <section className="border-y border-slate-100 bg-slate-light px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            What does &ldquo;vibe coding&rdquo; actually mean?
          </h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              You describe what you want software to do, and AI helps you create and
              revise the code behind it. That makes experimenting more accessible,
              including for people who are new to programming.
            </p>
            <p>
              But getting something on screen is only part of building something useful.
              You still need to understand the problem, check the result, and decide what
              to change. That judgment &mdash; what to build, how to test it, when to
              trust it, and what you owe the people who use it &mdash; is what Vibe
              Coding OS is really about.
            </p>
          </div>
        </div>
      </section>

      {/* 4 — The book's questions */}
      <section className="px-6 py-16 md:py-20">
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

      {/* 5 — Author */}
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
              Why I&apos;m writing Vibe Coding OS
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
              <p>
                I&apos;ve spent two decades building technology companies, investing in
                early-stage startups at Svyam Ventures, and running Startup Grind Frisco,
                a community of over 1,200 founders. For most of that time, one assumption
                sat underneath everything: turning an idea into working software was
                expensive, slow, and reserved for people with technical teams.
              </p>
              <p>
                That assumption is breaking, and I&apos;ve been testing exactly where
                &mdash; through dozens of my own AI experiments and hundreds of
                conversations with people trying to build. What became possible surprised
                me. So did what still requires care, judgment, and honesty about the
                results.
              </p>
              <p>
                This book is my attempt to write down what I&apos;ve learned while it is
                still useful. You don&apos;t need to be a founder to use it. You need
                something you wish existed, and the curiosity to find out what it could
                become.
              </p>
            </div>
            <p className="pt-1 text-xs leading-relaxed text-slate-400">
              Most of the material comes out of work that&apos;s already public:{" "}
              <Link href="/lab" className="font-semibold text-teal-accent hover:underline">
                The Lab
              </Link>
              ,{" "}
              <Link href="/gpts" className="font-semibold text-teal-accent hover:underline">
                GPT Garden
              </Link>
              , and{" "}
              <Link
                href="/articles"
                className="font-semibold text-teal-accent hover:underline"
              >
                Articles
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* 6 — FAQ */}
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

      {/* 7 — Final signup */}
      <section
        id="join"
        className="border-t border-slate-100 bg-slate-light px-6 py-16 md:py-24"
      >
        <div className="mx-auto max-w-xl space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            What would you build if you knew where to start?
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-600">
            A useful tool, a small experiment, or an idea you have been carrying for
            years &mdash; there is a starting point worth exploring. Join the First
            Edition Circle for progress updates, launch news, and early material as
            chapters become readable.
          </p>
          <div className="premium-card mx-auto max-w-md p-7 text-left">
            <FirstEditionForm />
          </div>
        </div>
      </section>
    </div>
  );
}
