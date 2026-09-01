import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How I partner",
  description:
    "Workshops, speaking, and a small number of early-stage investments through Svyam Ventures. I keep this intentionally small.",
  alternates: { canonical: "https://rameshnuti.com/work-with-me" },
};

/**
 * Three ways to partner, and no form.
 *
 * The free AI assessment used to live here. It was removed because a standing
 * offer of free working sessions is a service commitment, and this page should
 * not create one. Email is deliberately the whole mechanism: no intake form,
 * no calendar, nothing that implies a response time.
 */
const CONTACT = "ramesh@svyam.co";

const WAYS = [
  {
    index: "01",
    name: "Workshops",
    copy: "I occasionally run hands-on sessions for founder groups and teams on practical AI, AI workflows, and building with AI. The goal is always to leave with something useful, not another presentation about AI.",
    cta: {
      label: "Invite me to run a workshop",
      href: `mailto:${CONTACT}?subject=${encodeURIComponent("Workshop invitation")}`,
    },
    // The AI agent workshop page is the closest thing to a sample session.
    aside: { label: "See a past workshop", href: "/workshop" },
  },
  {
    index: "02",
    name: "Speaking",
    copy: "I speak about building companies, AI-native entrepreneurship, vibe coding, and what changes when founders can move from idea to evidence much faster.",
    cta: {
      label: "Invite me to speak",
      href: `mailto:${CONTACT}?subject=${encodeURIComponent("Speaking invitation")}`,
    },
    aside: null,
  },
  {
    index: "03",
    name: "Angel investing",
    copy: "I make a small number of early-stage investments through Svyam Ventures. I'm most useful when I understand the founder, the problem, and where I can genuinely help beyond the check.",
    cta: { label: "Learn about Svyam Ventures", href: "https://svyam.co", external: true },
    aside: null,
  },
];

export default function HowIPartnerPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            Partner
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            How I partner
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            I keep this intentionally small. I&apos;m still running companies, building
            things, and working with founders, so I only say yes when there&apos;s a genuine
            fit.
          </p>
        </div>
      </section>

      {/* Three ways */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid gap-6">
          {WAYS.map((way) => (
            <div
              key={way.name}
              id={way.name === "Speaking" ? "speaking" : undefined}
              className="premium-card scroll-mt-20 p-7 md:p-8 flex flex-col md:flex-row md:items-start gap-6 md:gap-10"
            >
              <div className="md:w-2/3 space-y-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-teal-accent">
                  {way.index}
                </span>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{way.name}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{way.copy}</p>
              </div>

              <div className="md:w-1/3 flex flex-col gap-2.5 md:pt-7">
                <a
                  href={way.cta.href}
                  {...("external" in way.cta && way.cta.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="btn-secondary px-5 py-3 text-sm text-center no-underline"
                >
                  {way.cta.label} &rarr;
                </a>
                {way.aside && (
                  <a
                    href={way.aside.href}
                    className="text-xs text-slate-500 hover:text-slate-900 no-underline text-center transition-colors"
                  >
                    {way.aside.label}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* A way in that costs nobody anything, including me. */}
        <div className="mt-10 pt-8 border-t border-slate-100 max-w-2xl">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Not sure where you fit?
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            I&apos;m always happy to meet thoughtful founders through Startup Grind,
            workshops, and the communities I&apos;m part of.
          </p>
          <a
            href="https://startupgrind.com/frisco"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-bold text-teal-accent no-underline hover:underline"
          >
            Find a Startup Grind event &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
