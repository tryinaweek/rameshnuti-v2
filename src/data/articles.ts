export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "AI & Startups" | "Vibe Coding" | "Growth & Audience" | "Personal Systems";
  readTime: string;
  tags: string[];
  url: string;
}

export const articles: Article[] = [
  {
    slug: "how-to-start-a-startup-in-the-ai-era",
    title: "How to Start a Startup in the AI Era",
    description: "An operator's guide to finding AI startup ideas, building defensible moats, and applying the Last $5K Rule.",
    date: "March 2026",
    category: "AI & Startups",
    readTime: "12 min read",
    tags: ["AI", "Startups", "Strategy"],
    url: "/writing/how-to-start-a-startup-in-the-ai-era",
  }
];
