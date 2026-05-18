import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const sizes = {
  sm: { wrap: "text-xs px-2.5 py-1 gap-1",   icon: 13 },
  md: { wrap: "text-sm px-3   py-1.5 gap-1.5", icon: 14 },
};

export default function SectionLink({
  href,
  children,
  size = "sm",
  external = false,
  back = false,
  className = "",
}) {
  const s = sizes[size] ?? sizes.sm;

  const styles = [
    "group inline-flex items-center shrink-0 font-medium rounded-full",
    "text-zinc-400 hover:text-zinc-100",
    "border border-white/[0.08] hover:border-white/[0.16]",
    "bg-white/[0.04] hover:bg-white/[0.07]",
    "transition-all duration-200 active:scale-[0.97]",
    s.wrap,
    className,
  ].join(" ");

  const iconClass =
    "text-indigo-400 group-hover:text-indigo-300 transition-all duration-200";

  const content = back ? (
    <>
      <ChevronLeft
        size={s.icon}
        strokeWidth={2.5}
        className={`${iconClass} group-hover:-translate-x-0.5`}
        aria-hidden
      />
      <span>{children}</span>
    </>
  ) : (
    <>
      <span>{children}</span>
      <ChevronRight
        size={s.icon}
        strokeWidth={2.5}
        className={`${iconClass} group-hover:translate-x-0.5`}
        aria-hidden
      />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={styles}>
      {content}
    </Link>
  );
}
