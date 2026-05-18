/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compression ────────────────────────────────────────────────────────────
  compress: true,

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
