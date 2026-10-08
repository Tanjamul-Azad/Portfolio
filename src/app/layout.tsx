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
  AiChatLauncher,
  CursorDot,
  ScrollProgress,
  StickyEmail,
} from "@/components/effects";
import { Analytics } from "@vercel/analytics/next";
import { themeScript } from "@/lib/theme-script";

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
    "AI Engineer Bangladesh",
    "NLP Researcher Dhaka",
    "Generative AI Researcher",
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
    siteName: siteConfig.author.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.author.name} — ${siteConfig.author.role}`,
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
  // Profile-photo favicons. Google's search-result favicon must be square and
  // a multiple of 48px, so the 48/96 PNGs are what it picks up.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
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
      <head>
        {/* Sets the stored theme on <html> before first paint. Static,
            developer-authored string — no user input. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          // Static, developer-authored JSON built from siteConfig — no user input.
          dangerouslySetInnerHTML={{
            // WebSite gives Google a site name to show instead of "Vercel";
            // ProfilePage + Person tie every name spelling to this one entity.
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteConfig.url}/#website`,
                  url: siteConfig.url,
                  name: siteConfig.author.name,
                  alternateName: [
                    "Tanzamul Azad",
                    "Tanjamul Azad",
                    "Tanzamul Azad Portfolio",
                  ],
                  inLanguage: "en",
                  publisher: { "@id": `${siteConfig.url}/#person` },
                },
                {
                  "@type": "ProfilePage",
                  "@id": `${siteConfig.url}/#profilepage`,
                  url: siteConfig.url,
                  name: siteConfig.title,
                  isPartOf: { "@id": `${siteConfig.url}/#website` },
                  mainEntity: { "@id": `${siteConfig.url}/#person` },
                },
                {
                  "@type": "Person",
                  "@id": `${siteConfig.url}/#person`,
                  name: siteConfig.author.name,
                  givenName: "Tanzamul",
                  familyName: "Azad",
                  additionalName: "Tonmoy",
                  alternateName: siteConfig.author.alternateNames,
                  url: siteConfig.url,
                  image: `${siteConfig.url}${siteConfig.author.avatar ?? "/images/profile.jpg"}`,
                  jobTitle: siteConfig.author.role,
                  description: siteConfig.description,
                  email: `mailto:${siteConfig.contact.email}`,
                  nationality: { "@type": "Country", name: "Bangladesh" },
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Dhaka",
                    addressCountry: "BD",
                  },
                  sameAs: [
                    siteConfig.links.github,
                    siteConfig.links.linkedin,
                    siteConfig.links.twitter,
                    siteConfig.links.facebook,
                  ],
                  alumniOf: [
                    {
                      "@type": "CollegeOrUniversity",
                      name: "United International University",
                      url: "https://www.uiu.ac.bd/",
                    },
                    { "@type": "EducationalOrganization", name: "Dhaka College" },
                  ],
                  knowsAbout: [
                    "Natural Language Processing",
                    "Generative AI",
                    "Large Language Models",
                    "Neuro-Symbolic AI",
                    "AI Agents",
                    "Retrieval-Augmented Generation",
                    "Federated Learning",
                    "Machine Learning",
                    "Data Science",
                    "Full-Stack Development",
                  ],
                },
              ],
            }),
          }}
        />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider>

          <CursorDot />
          <RouteTransitionProvider>
            <HashScrollManager />
            <ScrollProgress />
            <StickyEmail />
            <AiChatLauncher />
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
