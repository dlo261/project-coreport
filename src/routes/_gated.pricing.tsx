import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — CorePort" },
      {
        name: "description",
        content:
          "How CorePort prices compute, GPU, storage and game servers, with dated reference pricing from comparable providers.",
      },
      { property: "og:title", content: "Pricing — CorePort" },
      {
        property: "og:description",
        content: "Platform take rates and dated reference pricing, refreshed rather than claimed permanently.",
      },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="Pricing"
      title="Priced from configuration, not constants"
      state="in_progress"
      lede="Take rates, host pool shares and tier thresholds are stored as editable configuration rows that the public estimator and the real scheduler both read. The dated competitor comparison table is seeded and gets rendered here in Phase 2."
    />
  ),
});
