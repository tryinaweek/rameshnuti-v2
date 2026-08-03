/**
 * Substack feed for /articles.
 *
 * Per RAMESH OS: articles are canonical at rameshnuti.com/articles; Substack is
 * delivery only. Until the long-form bodies are migrated here, this page lists
 * every post from the public feed and links out to read them.
 *
 * The seed list below is a snapshot of the feed so the page still renders every
 * known post if Substack is unreachable at build/revalidate time. New posts
 * appear automatically from the live feed; the seed only needs updating if a
 * post falls out of the feed window.
 */

export interface FeedPost {
  title: string;
  url: string;
  /** ISO date (YYYY-MM-DD) — used for sorting and display. */
  date: string;
  description: string;
}

const FEED_URL = "https://startupvalue.substack.com/feed";

/** Snapshot of the public feed, 2026-08-03. */
const seedPosts: FeedPost[] = [
  {
    title: "AI Stopped Waiting for Your Prompt This Week",
    url: "https://startupvalue.substack.com/p/ai-stopped-waiting-for-your-prompt",
    date: "2026-08-01",
    description:
      "AI can now understand your context, listen to your thinking, operate tools, and take action. Here are four changes you can put to work immediately.",
  },
  {
    title: "An AI agent escaped its sandbox. I spent 14 years in security.",
    url: "https://startupvalue.substack.com/p/an-ai-agent-escaped-its-sandbox-i",
    date: "2026-07-25",
    description: "Plus the exact prompt for running agents that can't hurt you.",
  },
  {
    title: "The Vibe Coding Stack for Non-Technical Founders",
    url: "https://startupvalue.substack.com/p/the-vibe-coding-stack-for-non-technical",
    date: "2026-05-30",
    description: "The Three Layers of the Vibe Coding Stack.",
  },
  {
    title: "Essential AI Skills for 2026 (Full Presentation)",
    url: "https://startupvalue.substack.com/p/essential-ai-skills-for-2026-full",
    date: "2026-02-02",
    description:
      "49 slides from my Startup Grind Frisco talk. Prompting, agents, vibe coding, and more.",
  },
  {
    title: "Execution Handoffs",
    url: "https://startupvalue.substack.com/p/execution-handoffs",
    date: "2025-12-31",
    description: "Why most initiatives don't fail at ideation.",
  },
  {
    title: "Decision Capture",
    url: "https://startupvalue.substack.com/p/decision-capture",
    date: "2025-12-25",
    description: "The system that turns choices into company memory.",
  },
  {
    title: "The Founder Operations OS: The 6 Systems That Run My Companies.",
    url: "https://startupvalue.substack.com/p/the-founder-operations-os-the-6-systems",
    date: "2025-12-17",
    description: "Why companies don't scale. And why it's rarely a talent problem.",
  },
  {
    title: "The Follow-Up Agent: The First AI System Every Founder Should Build",
    url: "https://startupvalue.substack.com/p/the-follow-up-agent-the-first-ai",
    date: "2025-12-10",
    description: "Every founder has one enemy.",
  },
];

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");
}

function tagContent(item: string, tag: string): string {
  const match = item.match(
    new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
  );
  return match ? decodeEntities(match[1].trim()) : "";
}

function parseFeed(xml: string): FeedPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const posts: FeedPost[] = [];
  for (const item of items) {
    const title = tagContent(item, "title");
    const url = tagContent(item, "link");
    const pubDate = tagContent(item, "pubDate");
    const parsed = new Date(pubDate);
    if (!title || !url.startsWith("https://") || Number.isNaN(parsed.getTime())) {
      continue;
    }
    posts.push({
      title,
      url,
      date: parsed.toISOString().slice(0, 10),
      description: tagContent(item, "description"),
    });
  }
  return posts;
}

/**
 * Live feed merged over the seed snapshot (keyed by URL, newest first), so a
 * feed outage never blanks the page and posts that age out of the feed window
 * are still listed.
 */
export async function getSubstackPosts(): Promise<FeedPost[]> {
  const byUrl = new Map<string, FeedPost>(seedPosts.map((p) => [p.url, p]));
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 21600 } });
    if (res.ok) {
      for (const post of parseFeed(await res.text())) {
        byUrl.set(post.url, post);
      }
    }
  } catch {
    // Unreachable feed — render from the seed snapshot.
  }
  return [...byUrl.values()].sort((a, b) => b.date.localeCompare(a.date));
}
