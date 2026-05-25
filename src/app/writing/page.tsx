import type { Metadata } from "next";
import WritingHub from "./WritingHub";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Thinking about AI, vibe coding, and what it means to build when the rules keep changing. Articles, guides, and frameworks by Ramesh Nuti.",
  alternates: {
    canonical: "https://rameshnuti.com/writing",
  },
  openGraph: {
    title: "Writing | Ramesh Nuti",
    description:
      "Thinking about AI, vibe coding, and what it means to build when the rules keep changing. Articles, guides, and frameworks.",
    url: "https://rameshnuti.com/writing",
    siteName: "Ramesh Nuti",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ramesh Nuti Writing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Ramesh Nuti",
    description:
      "Thinking about AI, vibe coding, and what it means to build when the rules keep changing. Articles, guides, and frameworks.",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <WritingHub />;
}
