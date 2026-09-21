import type { ReactNode } from "react";

import { LogoMark } from "./Logo";
import { StateBadge } from "./StateBadge";

/**
 * Shell for gated surfaces whose full build lands in a later phase. It states
 * plainly what will live here — no fabricated network statistics.
 */
export function PhasePanel({
  eyebrow,
  title,
  lede,
  state,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  state: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        <StateBadge state={state} />
      </div>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{lede}</p>

      {children ? (
        <div className="mt-10">{children}</div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-16 text-center shadow-panel">
          <LogoMark className="h-9 w-9 text-muted-foreground/50" />
          <p className="max-w-md text-sm text-muted-foreground">
            Nothing to show here yet. This surface is built out in a later phase, and any figures it
            eventually shows are labelled as illustrative until a real fleet reports them.
          </p>
        </div>
      )}
    </div>
  );
}
