import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Ramesh Nuti",
    template: "%s | Ramesh Nuti",
  },
  description:
    "75+ AI projects shipped. All vibe coded. I'll teach you the system.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rameshnuti.com",
    siteName: "Ramesh Nuti",
    title: "Ramesh Nuti",
    description:
      "75+ AI projects shipped. All vibe coded. I'll teach you the system.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ramesh Nuti - Builder. Investor. Educator.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramesh Nuti",
    description:
      "75+ AI projects shipped. All vibe coded. I'll teach you the system.",
    images: ["/og-image.png"],
    creator: "@RameshNuti",
  },
  metadataBase: new URL("https://rameshnuti.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
