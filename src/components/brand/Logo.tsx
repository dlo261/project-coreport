import { cn } from "@/lib/utils";

/** Three connected nodes forming a network graph: a triangle with a filled circle at each vertex. */
export function LogoMark({
  className,
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("h-7 w-7", spin && "animate-spin", className)}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      >
        <path d="M16 6 L26.5 24 L5.5 24 Z" />
      </g>
      <circle cx="16" cy="6" r="4" fill="currentColor" />
      <circle cx="26.5" cy="24" r="4" fill="currentColor" />
      <circle cx="5.5" cy="24" r="4" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-7 w-7 text-primary" />
      <span className="text-[1.0625rem] font-semibold tracking-tight">CorePort</span>
    </span>
  );
}
