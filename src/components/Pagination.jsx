"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange, className = "" }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-1 sm:gap-2 ${className}`}
      aria-label="Pagination"
    >
      <PageButton
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </PageButton>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <PageButton
            key={p}
            onClick={() => onPageChange(p)}
            active={p === page}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PageButton>
        ),
      )}

      <PageButton
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </PageButton>
    </nav>
  );
}

function PageButton({ children, onClick, disabled, active, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        min-w-[38px] h-9 px-2 rounded-lg text-sm font-semibold transition-all duration-150
        disabled:opacity-35 disabled:cursor-not-allowed
        ${
          active
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
            : "text-zinc-300 hover:text-white hover:bg-white/[0.06]"
        }
      `}
      style={active ? {} : { background: "#1a1a1a", border: "1.5px solid #2e2e2e" }}
      {...props}
    >
      {children}
    </button>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("…");
    }
    result.push(sorted[i]);
  }
  return result;
}
