import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compression ────────────────────────────────────────────────────────────
  compress: true,

  // A stray package-lock.json in the user's home directory was causing
  // Turbopack to infer the wrong workspace root, which in turn made its
  // persistent disk cache resolve OUTSIDE this project — leading to stale
  // cached renders (e.g. Navbar hydration mismatches) surviving even a
  // full restart. Pinning the root here fixes both issues for good.
  turbopack: {
    root: __dirname,
  },

  // ── Images ─────────────────────────────────────────────────────────────────
  // CRITICAL COST SAVING: Skip Next.js image re-optimization for TMDB images.
  // TMDB's own CDN (image.tmdb.org) already serves WebP/AVIF from a global CDN.
  // Every /_next/image request = 1 Edge Request + bandwidth. With unoptimized,
  // images load directly from image.tmdb.org — zero Vercel image invocations.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
    dangerouslyAllowSVG: false,
  },

  // ── HTTP cache headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      // Static Next.js chunks — immutable, hashed filenames
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Edge-cached API routes — long SWR so origin is rarely hit
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // ISR detail pages
      {
        source: "/movie/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/tv/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/person/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Homepage
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // List pages
      {
        source: "/(discover|genres|genre|tv|upcoming|watchlist|search)(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=43200, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
