"use client";

import Image from "next/image";
import { useState } from "react";

export default function BackdropImage({ src, alt, className = "" }) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-[var(--background)] to-[var(--background)] ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      onError={() => setBroken(true)}
      sizes="100vw"
      priority
    />
  );
}
