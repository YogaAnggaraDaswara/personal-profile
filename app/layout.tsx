import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import { profile, socials } from "@/content/profile";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yoga Daswara | IT Architecture & Systems Engineering",
    template: "%s | Yoga Daswara",
  },
  description:
    "Portfolio Yoga Daswara: IT Architecture & Systems Engineering leader in banking, driving digital transformation with scalable and secure solutions.",
  keywords: [
    "Yoga Daswara",
    "IT Architecture",
    "Systems Engineering",
    "Digital Banking",
    "Microservices",
    "Cloud Architecture",
    "GCP",
    "AWS",
    "Portfolio",
  ],
  authors: [{ name: "Yoga Anggara Daswara", url: siteUrl }],
  creator: "Yoga Anggara Daswara",
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: siteUrl,
    siteName: "Yoga Daswara Portfolio",
    title: "Yoga Daswara | IT Architecture & Systems Engineering",
    description:
      "IT Architecture & Systems Engineering leader in banking, driving digital transformation with scalable and secure solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoga Daswara | IT Architecture & Systems Engineering",
    description:
      "IT Architecture & Systems Engineering leader in banking, driving digital transformation with scalable and secure solutions.",
    creator: "@yogadaswara",
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
    name: "Bank Sahabat Sampoerna",
  },
  knowsAbout: [
    "Enterprise Architecture",
    "Microservices",
    "Cloud Computing",
    "Digital Banking",
    "AI-assisted Development",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yoga Daswara Portfolio",
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
      lang="id"
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
