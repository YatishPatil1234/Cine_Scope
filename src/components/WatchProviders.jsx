"use client";

import { useState } from "react";

const LOGO_BASE = "https://image.tmdb.org/t/p/w92";

const REGIONS = [
  { code: "US", label: "🇺🇸 US" },
  { code: "IN", label: "🇮🇳 IN" },
  { code: "GB", label: "🇬🇧 UK" },
  { code: "CA", label: "🇨🇦 CA" },
  { code: "AU", label: "🇦🇺 AU" },
  { code: "DE", label: "🇩🇪 DE" },
  { code: "FR", label: "🇫🇷 FR" },
  { code: "JP", label: "🇯🇵 JP" },
];

export default function WatchProviders({ providersData }) {
  const available = REGIONS.filter((r) => providersData?.results?.[r.code]);
  const defaultRegion =
    available.find((r) => r.code === "IN") ??
    available.find((r) => r.code === "US") ??
    available[0];

  const [selected, setSelected] = useState(defaultRegion?.code ?? "US");

  if (!available.length) return null;

  const region = providersData?.results?.[selected];
  if (!region) return null;

  const flatrate = region.flatrate ?? [];
  const rent = region.rent ?? [];
  const buy = region.buy ?? [];
  const groups = [
    { label: "Stream", items: flatrate },
    { label: "Rent", items: rent },
    { label: "Buy", items: buy },
  ].filter((g) => g.items.length > 0);

  if (groups.length === 0 && available.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <h2 className="section-title">Where to Watch</h2>
        {/* Region selector */}
        {available.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {available.map((r) => (
              <button
                key={r.code}
                onClick={() => setSelected(r.code)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-200 ${
                  selected === r.code
                    ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                    : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {groups.length > 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5 space-y-5">
          {groups.map(({ label, items }) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3 font-bold">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((p) => (
                  <div
                    key={p.provider_id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                    title={p.provider_name}
                  >
                    {p.logo_path && (
                      <img
                        src={`${LOGO_BASE}${p.logo_path}`}
                        alt=""
                        width={24}
                        height={24}
                        className="rounded-md"
                      />
                    )}
                    <span className="text-sm font-medium text-zinc-200">
                      {p.provider_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {region.link && (
            <a
              href={region.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
            >
              View all options on TMDB ↗
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 py-4">
          No providers available for this region.
        </p>
      )}
    </section>
  );
}
