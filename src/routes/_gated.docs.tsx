import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/docs")({
  head: () => ({
    meta: [
      { title: "Developer docs — CorePort" },
      {
        name: "description",
        content:
          "Quickstart, API key management and endpoint reference for node enrollment, workloads, leases, billing and provider endpoints.",
      },
      { property: "og:title", content: "Developer docs — CorePort" },
      { property: "og:description", content: "Programmatic access to CorePort infrastructure." },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="CorePort API"
      title="Developer documentation"
      state="planned"
      lede="Quickstart, key management and a full endpoint reference covering node enrollment, workloads, leases, billing and provider endpoints — with curl examples — are written in Phase 2."
    />
  ),
});
