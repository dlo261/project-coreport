import { cn } from "@/lib/utils";

export type StateKind = "healthy" | "deploying" | "warning" | "offline";

const STATE_CLASS: Record<StateKind, string> = {
  healthy: "bg-state-healthy-soft text-state-healthy",
  deploying: "bg-state-deploying-soft text-state-deploying",
  warning: "bg-state-warning-soft text-state-warning",
  offline: "bg-state-offline-soft text-state-offline",
};

/** Maps domain words (node status, deployment status, milestone state) onto the four brand states. */
export function toStateKind(value: string): StateKind {
  const v = value.toLowerCase();
  if (["live", "online", "running", "operational", "healthy", "recovered", "paid"].includes(v)) {
    return "healthy";
  }
  if (["in_progress", "deploying", "provisioning", "queued", "pending", "draining"].includes(v)) {
    return "deploying";
  }
  if (["degraded", "warning", "limited", "held", "investigating"].includes(v)) {
    return "warning";
  }
  if (["offline", "failed", "outage", "rejected", "unavailable"].includes(v)) {
    return "offline";
  }
  return "warning";
}

const LABELS: Record<string, string> = {
  live: "Live",
  in_progress: "In progress",
  planned: "Planned",
};

export function StateBadge({ state, className }: { state: string; className?: string }) {
  const kind = state === "planned" ? null : toStateKind(state);
  return (
    <span
      className={cn(
        "technical inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wider",
        kind ? STATE_CLASS[kind] : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", kind ? "bg-current" : "bg-muted-foreground/60")}
      />
      {LABELS[state] ?? state}
    </span>
  );
}
