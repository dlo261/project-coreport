import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CorePort" },
      {
        name: "description",
        content: "Your CorePort deployments, usage, wallet balance and budget caps.",
      },
      { property: "og:title", content: "Dashboard — CorePort" },
      { property: "og:description", content: "Deployments, usage, wallet and budget caps." },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="Dashboard"
      title="Your deployments and wallet"
      state="in_progress"
      lede="Deployments with one stable endpoint each, logs, usage metering and recovery history, plus wallet top-ups, hard budget caps and auto-stop before the balance reaches zero. Every balance shown here is derived from the append-only ledger, never a stored number."
    />
  ),
});
