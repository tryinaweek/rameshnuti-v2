import type { NextConfig } from "next";

/**
 * Pages that were retired in the September 2026 cleanup. Each old URL still
 * lands somewhere useful, so a link on LinkedIn, a slide, or a WhatsApp
 * message never 404s.
 *
 * All temporary (307) on purpose: a permanent redirect is cached by browsers
 * forever, and any of these could come back.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The newsletter lives on Substack; there is no second copy of it here.
      { source: "/newsletter", destination: "https://startupvalue.substack.com", permanent: false },
      // One writing hub. The article itself keeps its /writing/... URL.
      { source: "/writing", destination: "/articles", permanent: false },
      // Courses was a "coming soon" page; the real course is on /tools.
      { source: "/courses", destination: "/tools", permanent: false },
      // The free assessment was withdrawn.
      { source: "/book-an-assessment", destination: "/work-with-me", permanent: false },
      // Build With Me became the Saturday Substack playbook.
      { source: "/build", destination: "https://startupvalue.substack.com", permanent: false },
      { source: "/build/:slug", destination: "https://startupvalue.substack.com", permanent: false },
    ];
  },
};

export default nextConfig;
