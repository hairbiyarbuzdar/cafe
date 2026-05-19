import type { MetadataRoute } from "next";

import { BRAND } from "@/constants/nav";

/**
 * Web App Manifest.
 *
 * Served at `/manifest.webmanifest` (Next.js handles the URL). Drives:
 *   • Browser "Install app" prompt on Chromium / Edge / Android.
 *   • iOS Safari "Add to Home Screen" metadata (alongside apple-icon).
 *   • Window chrome when launched standalone (theme + background
 *     colors fill the title-bar / splash respectively).
 *
 * Theme color matches `--primary` in light mode (a warm coffee brown)
 * so the standalone window doesn't have a jarring chrome contrast.
 * Background is the cream off-white we paint behind the splash.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: BRAND.description,
    start_url: "/",
    scope: "/",
    id: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#FFF6E5",
    theme_color: "#6B4423",
    categories: ["business", "productivity", "food"],
    icons: [
      // Next.js serves `app/icon.svg` at `/icon`. We list it twice so the
      // install prompt has both a "normal" icon and a "maskable" variant
      // (Chromium uses the latter for adaptive home-screen masks on
      // Android and the standalone window decoration).
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
