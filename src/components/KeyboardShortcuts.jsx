"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Global keyboard shortcuts:
 *   /       → focus search bar (or navigate to /search)
 *   Escape  → blur focused element / close any open modal
 *   G H     → go home
 *   G D     → go to discover
 *   G T     → go to TV shows
 *   G W     → go to watchlist
 */
export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let gPressed = false;
    let gTimer   = null;

    const handler = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = ["input", "textarea", "select"].includes(tag) ||
                       document.activeElement?.isContentEditable;

      // "/" — focus search input or navigate to /search
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        const input = document.querySelector("input[type='search']");
        if (input) {
          input.focus();
        } else {
          router.push("/search");
        }
        return;
      }

      // Escape — blur focused element
      if (e.key === "Escape") {
        document.activeElement?.blur();
        return;
      }

      // "g" prefix shortcuts
      if (!isTyping) {
        if (e.key === "g" || e.key === "G") {
          gPressed = true;
          clearTimeout(gTimer);
          gTimer = setTimeout(() => { gPressed = false; }, 1000);
          return;
        }
        if (gPressed) {
          gPressed = false;
          clearTimeout(gTimer);
          const map = { h: "/", d: "/discover", t: "/tv", w: "/watchlist", s: "/search", l: "/lists" };
          const dest = map[e.key.toLowerCase()];
          if (dest) { e.preventDefault(); router.push(dest); }
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
