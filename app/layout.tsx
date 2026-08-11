import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import { profile, socials } from "@/content/profile";
import { brand, seo, defaultLang } from "@/content/site";
import { experiences } from "@/content/experience";
import { skillGroups } from "@/content/skills";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const viewport: Viewport = {
  themeColor: "#05050d",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.titleDefault,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: seo.locale,
    alternateLocale: seo.alternateLocale,
    url: siteUrl,
    siteName: brand.siteName,
    title: seo.titleDefault,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.titleDefault,
    description: seo.description,
    creator: seo.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

// Derive knowsAbout from actual skill data instead of hardcoding
const knowsAbout = skillGroups.flatMap((g) => g.items.filter((s) => s.level === 'expert').map((s) => s.name));

// Derive worksFor from the first (most recent) experience entry
const currentJob = experiences[0];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.typingRoles[0],
  description: profile.tagline.en,
  url: siteUrl,
  sameAs: socials.map((s) => s.url),
  worksFor: {
    "@type": "Organization",
    name: currentJob.company,
  },
  knowsAbout,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.siteName,
  url: siteUrl,
  description: profile.tagline.en,
  author: {
    "@type": "Person",
    name: profile.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
