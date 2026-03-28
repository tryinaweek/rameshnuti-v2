import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
  description: "Learn to build with AI. Courses for non-technical founders by Ramesh Nuti.",
};

const liveCourses = [
  {
    title: "14-Day Prompting Course",
    description:
      "Learn prompting by doing. Daily exercises, real templates, and a system you can use forever. 100+ founders have taken this course.",
    url: "https://playwithprompts.com",
    tag: "Free",
    tagColor: "bg-teal-mint/15 text-teal-mint",
  },
];

const upcoming = [
  {
    title: "AI Agent Building Workshop",
    description:
      "Build your first AI agent in a single session. From idea to deployed agent. Part of Startup Grind Frisco workshops (Apr-Jun 2026).",
    tag: "Apr 2026",
  },
  {
    title: "Vibe Coding Your MVP",
    description:
      "Ship a working product in a weekend using AI tools. No coding experience required. Hands-on workshop.",
    tag: "May 2026",
  },
  {
    title: "AI Workflow Automation",
    description:
      "Automate the repetitive parts of your business with AI agents and workflows. For operators, not engineers.",
    tag: "Jun 2026",
  },
];

export default function CoursesPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-midnight py-16 px-6 relative overflow-hidden">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(194,105,74,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-terra-400 text-sm font-semibold tracking-wider uppercase mb-3">
            Learn the System
          </p>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Courses for Builders
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg leading-relaxed">
            Everything I know about building with AI, packaged into courses
            designed for people who have never written a line of code.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Live Courses */}
        <h2 className="text-xl font-bold text-midnight mb-4">Available Now</h2>
        <div className="space-y-4 mb-14">
          {liveCourses.map((course) => (
            <a
              key={course.title}
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-gray-100 rounded-xl p-6 no-underline hover:border-teal-mint transition-colors group"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 w-8 bg-teal-mint rounded" />
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${course.tagColor}`}>
                  {course.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-midnight group-hover:text-teal-mint transition-colors">
                {course.title}
              </h3>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {course.description}
              </p>
              <span className="inline-block mt-3 text-teal-mint text-sm font-bold">
                Start Learning &rarr;
              </span>
            </a>
          ))}
        </div>

        {/* Upcoming */}
        <h2 className="text-xl font-bold text-midnight mb-2">Coming Soon</h2>
        <p className="text-text-secondary text-sm mb-6">
          Join the waitlist to get early access and launch pricing.
        </p>
        <div className="space-y-4 mb-10">
          {upcoming.map((course) => (
            <div
              key={course.title}
              className="bg-white border border-gray-100 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="h-0.5 w-8 bg-terra-400 rounded" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-terra-400 bg-terra-400/10 px-2 py-0.5 rounded">
                  {course.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-midnight">{course.title}</h3>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {course.description}
              </p>
            </div>
          ))}
        </div>

        {/* Waitlist CTA */}
        <div className="bg-midnight rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(194,105,74,0.15)_0%,transparent_70%)] pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">
            Get notified when courses launch
          </h3>
          <p className="text-white/50 text-sm mb-4 relative z-10">
            Early access. Launch pricing. No spam.
          </p>
          <iframe
            src="https://rameshnuti.substack.com/embed"
            width="100%"
            height="150"
            className="border-0 rounded-lg max-w-sm mx-auto relative z-10"
            title="Course waitlist"
          />
        </div>
      </div>
    </div>
  );
}
