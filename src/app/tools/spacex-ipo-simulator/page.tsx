import type { Metadata } from "next";
import Simulator from "./Simulator";

export const metadata: Metadata = {
  title: "SpaceX IPO Investment Simulator | Ramesh Nuti",
  description:
    "Model a SpaceX IPO investment against the S&P 500. Adjust valuation, IPO allocation fill rate, revenue growth, and exit multiple to see why a ~110x revenue multiple is the number that decides your return. A teaching tool, not financial advice.",
  keywords: [
    "SpaceX IPO",
    "SpaceX IPO simulator",
    "SPCX",
    "SpaceX stock",
    "SpaceX valuation",
    "IPO investment calculator",
  ],
  alternates: {
    canonical: "https://rameshnuti.com/tools/spacex-ipo-simulator",
  },
  openGraph: {
    title: "SpaceX IPO Investment Simulator",
    description:
      "A retail investor can be right about SpaceX and still lose to an index fund. Model it yourself: valuation, fill rate, revenue growth, and the exit multiple that decides everything.",
    url: "https://rameshnuti.com/tools/spacex-ipo-simulator",
    siteName: "Ramesh Nuti",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpaceX IPO Investment Simulator",
    description:
      "A retail investor can be right about SpaceX and still lose to an index fund. Model it yourself.",
  },
};

export default function Page() {
  return <Simulator />;
}
