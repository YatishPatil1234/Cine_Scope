"use client";

import { profileUrl } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function PersonCard({ person }) {
  const [broken, setBroken] = useState(false);
  const src = profileUrl(person.profile_path);

  return (
    <Link
      href={`/person/${person.id}`}
      className="block group shrink-0 w-[108px] sm:w-[126px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0f0f0f] group-hover:border-indigo-500/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-indigo-950/40">
        {src && !broken ? (
          <Image
            src={src}
            alt={person.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="130px"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-zinc-600 bg-zinc-900">
            {person.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}
        <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors leading-snug">
          {person.name}
        </p>
        {person.known_for_department && (
          <p className="text-xs text-zinc-500 truncate mt-0.5">
            {person.known_for_department}
          </p>
        )}
      </div>
    </Link>
  );
}
