import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Courses | Ramesh Nuti",
  description: "Learn to build with AI. Courses for non-technical founders by Ramesh Nuti.",
};

const liveCourses = [
  {
    title: "14-Day Prompting Course",
    description:
      "Learn prompting by doing. Daily exercises, production templates, and a mental framework you can use forever. Over 100+ founders have graduated.",
    url: "https://playwithprompts.com",
    tag: "FREE",
    isExternal: true,
  },
  {
    title: "AI Agent Building Workshop (Resources)",
    description:
      "Recreate the complete automated research agent workflow from our Startup Grind Frisco session. Access the n8n JSON schema, prompting scripts, and guide.",
    url: "/workshop",
    tag: "FREE RESOURCES",
    isExternal: false,
  },
];

const upcoming = [
  {
    title: "Vibe Coding Your MVP",
    description:
      "Ship a functional working product in a single weekend using modern AI generators. No coding experience or engineering background required.",
    tag: "MAY 2026",
  },
  {
    title: "AI Workflow Automation",
    description:
      "Automate repetitive operational tasks, lead scraping, and copywriting pipelines using n8n and custom agents. Built for operators.",
    tag: "JUN 2026",
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Hero Header - Light slate styled banner */}
      <section className="bg-slate-light border-b border-slate-100 py-16 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 space-y-4 text-left">
          <span className="inline-block bg-teal-50 border border-teal-100 text-teal-accent px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase">
            ⚡ Distilled Playbooks
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Courses for Builders
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            Distilled execution playbooks on vibe coding, prompt engineering, and workflow automation. Built specifically for startup founders, non-technical builders, and operators.
          </p>
        </div>
      </section>

      {/* Live Courses */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8 text-left">
          Available Now
        </h2>
        <div className="space-y-6">
          {liveCourses.map((course) => {
            const Wrapper = course.isExternal ? "a" : Link;
            const linkProps = course.isExternal
              ? { href: course.url, target: "_blank", rel: "noopener noreferrer" }
              : { href: course.url };

            return (
              <Wrapper
                key={course.title}
                {...(linkProps as any)}
                className="premium-card p-8 flex flex-col justify-between group no-underline transition-all duration-300 text-left relative overflow-hidden block"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-teal-accent" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-teal-accent bg-teal-50 border border-teal-100 px-2.5 py-1 rounded">
                      {course.tag}
                    </span>
                    <span className="text-slate-300 group-hover:text-teal-accent transition-colors text-lg">&rarr;</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-accent transition-colors tracking-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-teal-accent">
                  {course.isExternal ? "Start Learning" : "Access Resources"} &rarr;
                </div>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-6 bg-slate-light border-y border-slate-100">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Coming Soon</h2>
            <p className="text-slate-500 text-sm mt-1">
              Join the waitlist to receive early-bird updates and cohort invitations.
            </p>
          </div>
          
          <div className="space-y-6">
            {upcoming.map((course) => (
              <div
                key={course.title}
                className="premium-card p-8 flex flex-col justify-between no-underline relative overflow-hidden text-left opacity-80"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-300" />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-block text-[10px] font-mono font-bold tracking-wider uppercase text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                      {course.tag}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-light border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-center space-y-6">
            <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-teal-accent bg-teal-50 border border-teal-100 px-2.5 py-1 rounded">
              COURSE ALERTS
            </span>
            
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Get notified when courses launch
            </h3>
            
            <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
              Be the first to know when pilot applications open. No spam, unsubscribe anytime.
            </p>
            
            <NewsletterForm variant="standard" buttonText="Join Waitlist" placeholder="Enter your email" />
          </div>
        </div>
      </section>
    </div>
  );
}
