import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";
import { LAB_APPS, LAB_COUNT_CLAIM, type LabStatus } from "@/data/lab";

export const metadata: Metadata = {
  title: "The Lab",
  description:
    "75+ AI products shipped, all vibe coded. The living portfolio: a daily game, mobile apps, tools, and experiments.",
};

const STATUS_LABEL: Record<LabStatus, string> = {
  flagship: "FLAGSHIP",
  venture: "ON THE APP STORE",
  exhibit: "EXHIBIT",
};

const STATUS_STYLE: Record<LabStatus, string> = {
  flagship: "bg-teal-50 border-teal-100 text-teal-accent",
  venture: "bg-slate-900 border-slate-900 text-white",
  exhibit: "bg-slate-50 border-slate-200 text-slate-500",
};

export default function LabPage() {
  const flagship = LAB_APPS.filter((a) => a.status === "flagship");
  const rest = LAB_APPS.filter((a) => a.status !== "flagship");

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 space-y-4">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ {LAB_COUNT_CLAIM} PROJECTS SHIPPED
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            The Lab
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Everything here was built with AI — designed, coded, and shipped without a
            traditional engineering team. Some became products. All of them are proof
            that one person can ship. This is the system I teach.
          </p>
        </div>
      </section>

      {/* Flagship */}
      {flagship.length > 0 && (
        <section className="py-16 px-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">
            The Flagship
          </h2>
          {flagship.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group text-left"
            >
              <div className="space-y-3">
                <span
                  className={`inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${STATUS_STYLE[app.status]}`}
                >
                  {STATUS_LABEL[app.status]}
                </span>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                  {app.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  {app.description}
                </p>
              </div>
              <span className="btn-primary px-6 py-3 text-sm whitespace-nowrap self-start md:self-center">
                Play today&apos;s round &rarr;
              </span>
            </a>
          ))}
        </section>
      )}

      {/* Everything else */}
      <section className="pb-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          The Exhibits
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-2xl">
          Shipped, live, and left to run. Each one taught me something that made the
          next one faster.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card p-6 flex flex-col justify-between group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`inline-block border px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${STATUS_STYLE[app.status]}`}
                  >
                    {STATUS_LABEL[app.status]}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {app.category} · {app.year}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-accent transition-colors">
                  {app.name}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {app.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-slate-400 text-xs mt-8">
          More exhibits being catalogued — the full estate spans Replit, Lovable, and
          Vercel. The count on the homepage is real.
        </p>
      </section>

      {/* The pitch: the lab is the proof, the system is the product */}
      <section className="bg-slate-light border-t border-slate-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Want to build like this?
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed max-w-xl mx-auto">
            Every project in this lab came from the same repeatable system — and the
            system is teachable. I occasionally run hands-on sessions for founder
            groups and teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href="/workshop" className="btn-primary px-6 py-3 text-sm">
              See a past workshop
            </a>
            <a
              href="/work-with-me"
              className="border border-slate-200 text-slate-700 hover:bg-white rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
            >
              How I partner
            </a>
          </div>
          <div className="pt-6 max-w-md mx-auto">
            <NewsletterForm
              sourceTag="lab"
              variant="standard"
              buttonText="Get the weekly build"
              placeholder="Email address"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
