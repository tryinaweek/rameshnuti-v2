import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { LAB_COUNT_CLAIM } from "@/data/lab";
import { buildNumberLabel, findFeaturedBuild } from "@/lib/builds";

export const metadata: Metadata = {
  title: "Ramesh Nuti | Founder, Builder, Investor",
  description:
    "I'm Ramesh Nuti. Founder, investor, and builder. I share what I'm learning about AI, help founders turn ideas into evidence faster, and back a few of them along the way.",
  alternates: { canonical: "https://rameshnuti.com" },
};

// Picks up a newly featured build without a redeploy.
export const revalidate = 60;

/** Credibility, not a headline. Every number here is backed elsewhere on the site. */
const PROOF = [
  { stat: `${LAB_COUNT_CLAIM} AI projects`, label: "shipped", href: "/lab" },
  { stat: "2x founder", label: "ActionEDI", href: "/about" },
  { stat: "25+ investments", label: "Svyam Ventures", href: "/about" },
  { stat: "Startup Grind", label: "Frisco director", href: "https://startupgrind.com/frisco" },
];

/**
 * The four paths the site is organized around. Each has one primary
 * destination plus the existing routes that sit underneath it, so nothing
 * that already works gets buried.
 */
const PATHS = [
  {
    index: "01",
    name: "Build",
    blurb:
      "Tools, experiments, the Lab, and workshops. Things I have actually shipped, with the useful parts left visible.",
    cta: { label: "Explore the Lab", href: "/lab" },
    links: [
      { label: "AI tools", href: "/tools" },
      { label: "Build With Me", href: "/build" },
      { label: "Workshops", href: "/workshops" },
    ],
  },
  {
    index: "02",
    name: "Learn",
    blurb:
      "Vibe Coding OS, articles, courses, and the frameworks I use. What I am figuring out, written down while it is still useful.",
    cta: { label: "Explore resources", href: "/articles" },
    links: [
      { label: "Vibe Coding OS", href: "/vibe-coding-os" },
      { label: "Courses", href: "/courses" },
      { label: "Writing", href: "/writing" },
    ],
  },
  {
    index: "03",
    name: "Connect",
    blurb:
      "Startup Grind Frisco, the builder community, events, workshops, and the founder conversations that happen around both.",
    cta: { label: "Connect", href: "#community" },
    links: [
      { label: "Startup Grind Frisco", href: "https://startupgrind.com/frisco", external: true },
      { label: "Events & workshops", href: "/workshops" },
    ],
  },
  {
    index: "04",
    name: "Partner",
    blurb:
      "I make a small number of early-stage investments through Svyam Ventures, and enjoy helping thoughtful founders when there is a genuine fit.",
    cta: { label: "How I partner", href: "/work-with-me" },
    links: [
      { label: "Svyam Ventures", href: "https://svyam.co", external: true },
      { label: "Speaking", href: "/work-with-me" },
    ],
  },
];

/** Three at most. The rest live on /tools and /gpts. */
const FEATURED = [
  {
    tag: "Live · AI tool",
    title: "Steelman the Opposition",
    description:
      "Paste your pitch. Get the strongest arguments against it before you walk into the room.",
    href: "/tools/steelman",
    label: "Try the critic",
    external: false,
  },
  {
    tag: "Founders course",
    title: "14-Day Prompting Course",
    description:
      "Advanced prompting through daily 10-minute lessons. Over 100 founders have gone through it.",
    href: "https://playwithprompts.com",
    label: "Start the course",
    external: true,
  },
  {
    tag: "GPT library",
    title: "GPT Garden",
    description:
      "Custom GPTs I built for real work: contracts, EDI files, decks, writing. Free to use.",
    href: "/gpts",
    label: "Browse the garden",
    external: false,
  },
];

export default async function HomePage() {
  // Null until a published build is flagged "feature on the homepage" in the
  // admin panel, so nothing reaches the homepage before Ramesh says so.
  const featured = await findFeaturedBuild();

  return (
    <div className="space-y-0 bg-white min-h-screen font-sans text-slate-900">

      {/* 1. HERO */}
      <section className="relative py-16 md:py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">

            <div className="md:col-span-7 space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-slate-600">
                Founder &middot; Builder &middot; Investor &middot; Educator
              </span>

              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
                Build faster.
                <br />
                <span className="text-teal-accent">Learn by doing.</span>
                <br />
                <span className="text-slate-500">Stay curious.</span>
              </h1>

              <p className="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
                I&apos;m Ramesh Nuti. Founder, investor, builder, and lifelong student of
                technology. I share what I&apos;m learning about AI, help founders turn ideas
                into evidence faster, and back a few of them along the way.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="#paths"
                  className="btn-primary px-6 py-3.5 text-sm text-center no-underline"
                >
                  Explore what I&apos;m building
                </a>
                <Link
                  href="/about"
                  className="btn-secondary px-6 py-3.5 text-sm text-center no-underline"
                >
                  About Ramesh
                </Link>
              </div>
            </div>

            <div
              className="md:col-span-5 relative flex justify-center md:justify-end animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="relative p-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <Image
                  src="/images/hero-speaking.jpeg"
                  alt="Ramesh Nuti teaching a room of founders"
                  width={340}
                  height={425}
                  priority
                  className="rounded-xl object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500 w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Proof row — credibility under the hero, not the headline. */}
          <div className="border-t border-slate-100 mt-16 pt-8">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {PROOF.map((p) => (
                <li key={p.stat}>
                  <Link
                    href={p.href}
                    {...(p.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="block no-underline group"
                  >
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                      {p.stat}
                    </span>
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                      {p.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION — operator first */}
      <section className="bg-brand-navy text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 items-center">

            <div className="md:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0 bg-white p-0.5">
                  <Image
                    src="/ramesh-nuti.jpeg"
                    alt=""
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hi, I&apos;m Ramesh Nuti.</h2>
                  <p className="text-xs text-brand-cyan font-mono tracking-wider uppercase">
                    Founder &middot; Investor &middot; Builder
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
                <p>
                  I&apos;ve spent more than two decades building technology companies,
                  investing in startups, and working alongside founders. I run{" "}
                  <a
                    href="https://actionedi.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cyan font-bold hover:underline"
                  >
                    ActionEDI
                  </a>
                  , a supply-chain integration company, invest through{" "}
                  <a
                    href="https://svyam.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cyan font-bold hover:underline"
                  >
                    Svyam Ventures
                  </a>
                  , and direct the Frisco chapter of Startup Grind.
                </p>
                <p>
                  AI has changed how quickly an idea can be tested and how quickly software
                  can be built. I&apos;m exploring that change the only way I know how: by
                  building things, teaching founders what works, and writing down the parts
                  that did not.
                </p>
                <p className="text-white">
                  The thread through all of it is distance. How much of it can we remove
                  between an idea and knowing whether it works?
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-block border border-white/80 hover:bg-white/10 text-white rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all no-underline"
                >
                  More about me &rarr;
                </Link>
              </div>
            </div>

            {/* Builder proof */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="bg-[#121c38] border border-white/10 rounded-2xl p-4 max-w-[320px] overflow-hidden shadow-2xl">
                <div className="h-1 bg-brand-cyan w-full rounded-t-lg mb-3" />
                <Image
                  src="/images/replit-rewind.jpeg"
                  alt="Replit Rewind 2025 showing top 5% status with 42 apps built"
                  width={300}
                  height={300}
                  className="rounded-lg object-contain"
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="pt-4 pb-2 px-1 text-center">
                  <p className="text-white font-bold text-sm">Replit Rewind 2025</p>
                  <p className="text-brand-cyan text-[10px] font-mono mt-1 font-bold uppercase tracking-wider">
                    Top 5% on Replit &middot; 42 apps
                  </p>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] font-mono mt-3 max-w-[280px] text-center leading-relaxed">
                Plus 30+ more shipped with Cursor, Claude Code, and Lovable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VIBE CODING OS */}
      <section className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-7 space-y-5">
            <span className="inline-block bg-blue-50 border border-blue-100 text-teal-accent px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase">
              Coming January 2027 &middot; New book
            </span>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Vibe Coding OS
              </h2>
              <p className="text-slate-500 text-base md:text-lg leading-snug mt-2 max-w-xl">
                A practical book for non-technical founders building in the age of AI.
              </p>
            </div>
            <div className="space-y-4 text-slate-600 text-[15px] md:text-base leading-relaxed max-w-xl">
              <p>
                The founders who win will be the ones who reduce the distance between an idea
                and evidence.
              </p>
              <p>
                Vibe Coding OS is my practical playbook for doing exactly that. Built from two
                decades of building companies, {LAB_COUNT_CLAIM} AI experiments, and hundreds
                of conversations with founders.
              </p>
            </div>
          </div>

          {/* Swap this card for a cover the day one exists: drop the image in
              place of the question block and keep the CTA underneath. */}
          <div className="md:col-span-5">
            <div className="premium-card p-7 space-y-5">
              <p className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                The central question
              </p>
              <p className="text-lg font-bold text-slate-900 leading-snug tracking-tight">
                How much distance can we remove between an idea and knowing whether it works?
              </p>
              <div className="pt-1 border-t border-slate-100 space-y-3">
                <Link
                  href="/vibe-coding-os"
                  className="btn-primary block px-6 py-3 text-sm text-center no-underline"
                >
                  Join the First Edition Circle
                </Link>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Follow the book as I finish it, read early ideas, and help shape the first
                  edition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BUILD / LEARN / CONNECT / PARTNER */}
      <section id="paths" className="scroll-mt-20 py-20 px-6 bg-slate-light border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Four ways in
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Most of what I do falls into one of these. Start wherever it&apos;s useful.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PATHS.map((path) => (
              <div key={path.name} className="premium-card p-7 flex flex-col text-left">
                <span className="text-xs font-mono font-bold text-teal-accent tracking-widest">
                  {path.index}
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1.5">
                  {path.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-2.5 flex-1">
                  {path.blurb}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <Link
                    href={path.cta.href}
                    className="text-sm font-bold text-teal-accent no-underline hover:underline"
                  >
                    {path.cta.label} &rarr;
                  </Link>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {path.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          {...("external" in l && l.external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className="text-xs text-slate-500 hover:text-slate-900 no-underline transition-colors"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BUILD WITH ME — appears only once a build is flagged in /admin */}
      {featured && (
        <section className="bg-brand-navy py-20 px-6 text-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                Build With Me &middot; Build {buildNumberLabel(featured.build_number)}
              </span>
              <h2 className="text-3xl font-bold tracking-tight">{featured.title}</h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                {featured.short_description}
              </p>
              <p className="text-slate-400 text-xs">
                {featured.difficulty} &middot; {featured.estimated_build_time}
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col gap-3 md:items-end">
              <Link
                href={`/build/${featured.slug}`}
                className="rounded-lg bg-white px-6 py-3.5 text-sm font-bold text-slate-900 no-underline text-center transition-colors hover:bg-slate-100"
              >
                Read the teardown &rarr;
              </Link>
              <Link
                href="/build"
                className="rounded-lg border border-white/25 px-6 py-3.5 text-sm font-bold text-white no-underline text-center transition-colors hover:bg-white/10"
              >
                See every build
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. FEATURED RESOURCES — three, then get out of the way */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              A few things worth using
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Free, no signup. Built because I needed them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED.map((item) =>
              item.external ? (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-card p-6 flex flex-col justify-between text-left no-underline group"
                >
                  <FeaturedBody {...item} />
                </a>
              ) : (
                <Link
                  key={item.title}
                  href={item.href}
                  className="premium-card p-6 flex flex-col justify-between text-left no-underline group"
                >
                  <FeaturedBody {...item} />
                </Link>
              ),
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-900 transition-colors no-underline"
            >
              Browse everything in the Lab &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 7. COMMUNITY — supports Connect, not a second funnel */}
      <section
        id="community"
        className="scroll-mt-20 py-20 px-6 bg-slate-light border-t border-slate-100"
      >
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Where founders find each other
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Two communities I spend time in, online and in person.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 text-left">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest text-[#25d366] bg-[#25d366]/10 border border-[#25d366]/20 px-2.5 py-1 rounded uppercase">
                Vibe coding chat
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-4">
                WhatsApp community
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">
                A working chat with builders and founders. Prompts, debugging, half-finished
                ideas, and the occasional thing that actually worked.
              </p>
              <a
                href="https://chat.whatsapp.com/D4KNtVUNHQo7ipId4yHSPO?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-sm font-bold text-teal-accent no-underline hover:underline"
              >
                Join the chat &rarr;
              </a>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-7 text-left">
              <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-teal-accent bg-blue-50 border border-blue-100 px-2.5 py-1 rounded uppercase">
                Local chapter
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-4">
                Startup Grind Frisco
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mt-2">
                I&apos;ve run the Frisco chapter for seven years. In-person workshops, panels,
                and founder meetups, most months.
              </p>
              <a
                href="https://startupgrind.com/frisco"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-sm font-bold text-teal-accent no-underline hover:underline"
              >
                See upcoming events &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The general newsletter signup used to sit here. The homepage now has
          one reason to give me an email address — the First Edition Circle —
          so it lives only in the Vibe Coding OS section above. /newsletter and
          NewsletterForm are untouched and still work elsewhere. */}

    </div>
  );
}

/** Shared card interior — the wrapper differs only by internal vs external link. */
function FeaturedBody({
  tag,
  title,
  description,
  label,
}: {
  tag: string;
  title: string;
  description: string;
  label: string;
}) {
  return (
    <>
      <div className="space-y-4">
        <span className="inline-block text-[9px] font-mono font-bold tracking-widest uppercase text-teal-accent bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
          {tag}
        </span>
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed">{description}</p>
      </div>
      <div className="mt-8 pt-4 border-t border-slate-200">
        <span className="text-xs font-bold text-teal-accent">{label} &rarr;</span>
      </div>
    </>
  );
}
