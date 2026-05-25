import type { Metadata } from "next";
import Scanner from "./Scanner";

export const metadata: Metadata = {
  title: "Strategic Market Scanner & Positioner | Ramesh Nuti",
  description:
    "Map out your competitors, identify unoccupied market gaps, and generate actionable GTM infiltration plans.",
  keywords: [
    "Market Scanner",
    "competitor research",
    "positioning matrix",
    "white space gap",
    "market map",
    "Svyam Ventures",
  ],
  alternates: {
    canonical: "https://rameshnuti.com/tools/market-scanner",
  },
  openGraph: {
    title: "Strategic Market Scanner & Positioner",
    description:
      "Map out your competitors, identify unoccupied market gaps, and generate actionable GTM infiltration plans.",
    url: "https://rameshnuti.com/tools/market-scanner",
    siteName: "Ramesh Nuti",
    type: "website",
    images: [
      {
        url: "/og-market-scanner.png",
        width: 1200,
        height: 630,
        alt: "Strategic Market Scanner Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Strategic Market Scanner & Positioner",
    description:
      "Map out your competitors, identify unoccupied market gaps, and generate actionable GTM infiltration plans.",
    images: ["/og-market-scanner.png"],
  },
};

export default function Page() {
  return <Scanner />;
}
