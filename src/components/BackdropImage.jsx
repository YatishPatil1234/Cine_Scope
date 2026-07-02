"use client";

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
    <img
      src={src}
      alt={alt}
      decoding="async"
      onError={() => setBroken(true)}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      className={className}
    />
  );
}
