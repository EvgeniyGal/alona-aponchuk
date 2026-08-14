"use client";

import { useEffect } from "react";

/**
 * Softens native scroll with CSS scroll-behavior and smooth hash navigation.
 * Respects prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    document.documentElement.classList.add("smooth-scroll");

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.documentElement.classList.remove("smooth-scroll");
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
