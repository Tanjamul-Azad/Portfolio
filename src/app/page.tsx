"use client";

import { useState } from "react";
import { Preloader } from "@/components/common";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  TechStack,
  Projects,
  Experience,
  Achievements,
  Now,
  Testimonials,
  Contact,
} from "@/components/sections";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="bg-neutral-50 dark:bg-black min-h-screen">
      <Preloader onComplete={() => setIsLoading(false)} />

      {!isLoading && (
        <>
          <Navbar />
          <Hero />
          <Now />
          <TechStack />
          <Projects />
          <Experience />
          <Achievements />
          <Testimonials />
          <Contact />
          <Footer />
        </>
      )}
    </main>
  );
}
