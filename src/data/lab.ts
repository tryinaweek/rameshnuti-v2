/**
 * The Lab — every product shipped, as portfolio proof.
 *
 * Estate rule (RAMESH OS): apps here are Exhibits — alive, linked, zero
 * maintenance obligation. Flagship and Venture get called out explicitly.
 * To add an app: one entry here, nothing else.
 */

export type LabStatus = "flagship" | "venture" | "exhibit";

export interface LabApp {
  name: string;
  url: string;
  description: string;
  category: string;
  status: LabStatus;
  year: number;
}

export const LAB_APPS: LabApp[] = [
  {
    name: "Catch the AI — Play with Prompts",
    url: "https://playwithprompts.com",
    description:
      "A daily 90-second game: spot what the AI got wrong. Streaks, live percentiles, and a 63-prompt library inside.",
    category: "AI education",
    status: "flagship",
    year: 2026,
  },
  {
    name: "Moved.Today",
    url: "https://apps.apple.com/us/app/moved-today/id6757989197",
    description: "One-button physical movement tracker. Intentionally minimal. Live on the iOS App Store.",
    category: "Mobile",
    status: "venture",
    year: 2026,
  },
  {
    name: "Sehath",
    url: "https://sehath.app",
    description: "An AI fitness coach that builds plans around your actual life.",
    category: "Health",
    status: "exhibit",
    year: 2026,
  },
  {
    name: "XBookmarkSync",
    url: "https://www.xbookmarksync.com",
    description:
      "AI-powered bookmark sync and content engine — rescue your X bookmarks and actually use them.",
    category: "Productivity",
    status: "exhibit",
    year: 2026,
  },
  {
    name: "The Headshot App",
    url: "https://www.theheadshotapp.com",
    description: "AI-powered professional headshots — three free to get started.",
    category: "AI imaging",
    status: "exhibit",
    year: 2025,
  },
  // ── Add the rest of the estate below (one object per app) ────────────────
  // Replit: Focus Filter, MailDigest, Stock Simple, AI Stack Analyzer,
  //   AIExposure, Review Engine, QuickQuotes, X12Validator, EDIPartnerSearch…
  // Lovable: Agent Builder Hub, Daily AI Reps, 47Day AI Cert Watch…
];

export const LAB_COUNT_CLAIM = "75+";
