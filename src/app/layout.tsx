import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import {
  HashScrollManager,
  PageTransition,
  RouteTransitionProvider,
  ThemeProvider,
} from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config";
import {
  AiChat,
  CursorDot,
  ScrollProgress,
  StickyEmail,
} from "@/components/effects";
import { Analytics } from "@vercel/analytics/next";

// Geist carries both display and body; Instrument Serif supplies the italic
// accent words in headings; Geist Mono sets the small labels and indices.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    // Name variants first — a personal portfolio's highest-value queries are
    // people searching the name, and this one is spelled several ways.
    ...(siteConfig.author.alternateNames ?? []),
    siteConfig.author.name,
    `${siteConfig.author.name} portfolio`,
    `${siteConfig.author.name} developer`,
    "Full-Stack Developer Bangladesh",
    "ML Researcher Dhaka",
    "United International University CSE",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.name,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Frontend Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitterHandle,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  // Search Console ownership proof. Not a secret — Google reads it from the
  // public page source — so it lives in code rather than an env var, with the
  // env var kept as an override. public/google42b74763a48b3e1f.html is the
  // file-based proof for the same property, as a fallback.
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION ??
      "TQh1YA_IZ3ebEUsrODyJ1zdHrlB2G6qjzCsR4f1hrbk",
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
  alternates: {
    canonical: siteConfig.url,
    types: { "application/rss+xml": `${siteConfig.url}/rss.xml` },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          // Static, developer-authored JSON built from siteConfig — no user input.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.author.name,
              alternateName: siteConfig.author.alternateNames,
              url: siteConfig.url,
              image: siteConfig.ogImage,
              jobTitle: siteConfig.author.role,
              email: `mailto:${siteConfig.contact.email}`,
              address: {
                "@type": "PostalAddress",
                addressLocality: siteConfig.author.location,
              },
              sameAs: [
                siteConfig.links.github,
                siteConfig.links.linkedin,
                siteConfig.links.twitter,
                siteConfig.links.facebook,
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "United International University",
              },
              worksFor: {
                "@type": "Organization",
                name: "Complete Legal Aid",
              },
              knowsAbout: [
                "Full-Stack Development",
                "Machine Learning",
                "React",
                "Next.js",
                "TypeScript",
                "Data Science",
              ],
            }),
          }}
        />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >

          <CursorDot />
          <RouteTransitionProvider>
            <HashScrollManager />
            <ScrollProgress />
            <StickyEmail />
            <AiChat />
            <div id="main-content" className="relative min-h-svh flex flex-col">
              <PageTransition>{children}</PageTransition>
            </div>
          </RouteTransitionProvider>
          <Toaster position="bottom-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
