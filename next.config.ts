import type { NextConfig } from "next";

/**
 * Pages that were retired in the September 2026 cleanup. Each old URL still
 * lands somewhere useful, so a link on LinkedIn, a slide, or a WhatsApp
 * message never 404s.
 *
 * The settled moves are permanent (308) so search engines move the old URL's
 * ranking to the new page and drop the old one from results. Build With Me
 * stays temporary (307): browsers cache a permanent redirect indefinitely, and
 * /build may be reused.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The newsletter lives on Substack; there is no second copy of it here.
      { source: "/newsletter", destination: "https://startupvalue.substack.com", permanent: true },
      // One writing hub. The article itself keeps its /writing/... URL.
      { source: "/writing", destination: "/articles", permanent: true },
      // Courses was a "coming soon" page; the real course is on /tools.
      { source: "/courses", destination: "/tools", permanent: true },
      // The free assessment was withdrawn.
      { source: "/book-an-assessment", destination: "/work-with-me", permanent: true },
      // Build With Me became the Saturday Substack playbook.
      { source: "/build", destination: "https://startupvalue.substack.com", permanent: false },
      { source: "/build/:slug", destination: "https://startupvalue.substack.com", permanent: false },
    ];
  },
};

export default nextConfig;
