import type { Metadata } from "next";
import Analyzer from "./Analyzer";

export const metadata: Metadata = {
  title: "Pitch Analyzer & Stress Tester | Ramesh Nuti",
  description:
    "Stress-test your pitch deck outline and GTM strategy against the Svyam Ventures investor checklist and real-world operational friction.",
  keywords: [
    "Pitch Analyzer",
    "Stress Tester",
    "pitch deck feedback",
    "GTM strategy testing",
    "startup pitch review",
    "Svyam Ventures",
  ],
  alternates: {
    canonical: "https://rameshnuti.com/tools/pitch-analyzer",
  },
  openGraph: {
    title: "Pitch Analyzer & Stress Tester",
    description:
      "Stress-test your pitch deck outline and GTM strategy against the Svyam Ventures investor checklist and real-world operational friction.",
    url: "https://rameshnuti.com/tools/pitch-analyzer",
    siteName: "Ramesh Nuti",
    type: "website",
    images: [
      {
        url: "/og-pitch-analyzer.png",
        width: 1200,
        height: 630,
        alt: "Pitch Analyzer & Stress Tester Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch Analyzer & Stress Tester",
    description:
      "Stress-test your pitch deck outline and GTM strategy against the Svyam Ventures investor checklist and real-world operational friction.",
    images: ["/og-pitch-analyzer.png"],
  },
};

export default function Page() {
  return <Analyzer />;
}
