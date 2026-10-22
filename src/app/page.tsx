import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  About,
  TechStack,
  Projects,
  Research,
  Experience,
  Achievements,
  Activities,
  Now,
  Testimonials,
  Blog,
  GitHub,
  Contact,
} from "@/components/sections";
import { siteConfig } from "@/config";

export default function Home() {
  return (
    <main className="scroll-container relative min-h-svh overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profilepage`,
        url: siteConfig.url,
        name: siteConfig.title,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        mainEntity: { "@id": `${siteConfig.url}/#person` },
      }).replace(/</g, "\\u003c") }} />
      {/* Plain wrapper: it used to fade the whole page in from opacity 0, which
          kept everything — the hero included — unpainted until hydration. */}
      <div className="relative z-10">
        <Navbar />
        {/* One Suspense boundary per section, so React hydrates the page as
            separate small units and yields between them, rather than in a
            few long blocks. Those blocks were landing exactly as a visitor
            started to scroll and froze the first swipe on phones. */}
        <Hero />
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <Now />
        </Suspense>
        <Suspense>
          <TechStack />
        </Suspense>
        <Suspense>
          <Projects />
        </Suspense>
        <Suspense>
          <Research />
        </Suspense>
        <Suspense>
          <Experience />
        </Suspense>
        <Suspense>
          <Achievements />
        </Suspense>
        <Suspense>
          <Activities />
        </Suspense>
        <Suspense>
          <Testimonials />
        </Suspense>
        <Suspense>
          <Blog />
        </Suspense>
        <Suspense>
          <GitHub />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
