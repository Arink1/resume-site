import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalaxyBackground } from "@/components/GalaxyBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.arinkarabulut.com";
const siteTitle = "Arin Karabulut | Software/AI Developer & Insurance Broker";
const siteDescription =
  "Software/AI developer and insurance broker building production software for sales teams, healthcare brokers, and small businesses. Calling and dialer platforms tuned for higher pickup rates and conversions, plus the SaaS, CRM, and AI tooling that wraps around them.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Arin Karabulut",
  },
  description: siteDescription,
  applicationName: "Arin Karabulut",
  authors: [{ name: "Arin Karabulut", url: siteUrl }],
  creator: "Arin Karabulut",
  keywords: [
    "Arin Karabulut",
    "full stack engineer",
    "AI engineer",
    "Next.js developer",
    "sales dialer software",
    "power dialer",
    "Twilio Voice SDK",
    "multi-tenant SaaS",
    "CRM software",
    "OnlyDialer",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Arin Karabulut",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@arinkarabulut",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <GalaxyBackground />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
