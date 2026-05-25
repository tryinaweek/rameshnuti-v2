import type { Metadata } from "next";
import SteelmanTool from "./SteelmanTool";

export const metadata: Metadata = {
  title: "Steelman the Opposition | Ramesh Nuti",
  description:
    "Put your proposal in front of the smartest skeptic in the room. Get the exact arguments investors and customers will use against you to strengthen your business model.",
  keywords: [
    "Steelman the Opposition",
    "vulnerability analysis",
    "skeptic arguments",
    "business model testing",
    "startup critique",
  ],
  alternates: {
    canonical: "https://rameshnuti.com/tools/steelman",
  },
  openGraph: {
    title: "Steelman the Opposition",
    description:
      "Put your proposal in front of the smartest skeptic in the room. Get the exact arguments investors and customers will use against you.",
    url: "https://rameshnuti.com/tools/steelman",
    siteName: "Ramesh Nuti",
    type: "website",
    images: [
      {
        url: "/og-steelman.png",
        width: 1200,
        height: 630,
        alt: "Steelman the Opposition Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steelman the Opposition",
    description:
      "Put your proposal in front of the smartest skeptic in the room. Get the exact arguments investors and customers will use against you.",
    images: ["/og-steelman.png"],
  },
};

export default function Page() {
  return <SteelmanTool />;
}
