"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader, INTRO_VISIT_KEY } from "./preloader";
import { MOTION_TOKENS } from "@/lib";

// Preserve the original once-per-session intro without making the homepage
// itself a Client Component or withholding its server-rendered content.
let shown = false;
const visitKey = INTRO_VISIT_KEY;

export function OpeningIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let alreadyShown = shown;
    try { alreadyShown ||= sessionStorage.getItem(visitKey) === "true"; }
    catch { /* The animation also works when browser storage is unavailable. */ }
    if (alreadyShown) setVisible(false);
  }, []);

  const complete = () => {
    shown = true;
    setVisible(false);
    try { sessionStorage.setItem(visitKey, "true"); }
    catch { /* Keep the in-memory visit flag if storage is unavailable. */ }
  };

  return <><noscript><style>{"#portfolio-opening-intro { display: none !important; }"}</style></noscript><AnimatePresence initial={false}>
    {visible && <motion.div
      key="opening-intro"
      id="portfolio-opening-intro"
      className="fixed inset-0 z-100"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
    >
      <Preloader onComplete={complete} />
    </motion.div>}
  </AnimatePresence></>;
}
