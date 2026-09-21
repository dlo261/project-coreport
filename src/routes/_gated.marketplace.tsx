import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — CorePort" },
      {
        name: "description",
        content:
          "Browse standardised infrastructure products by category, region, reliability class, tier and hourly price.",
      },
      { property: "og:title", content: "Marketplace — CorePort" },
      {
        property: "og:description",
        content: "Compute, GPU, storage and game server capacity by tier, region and reliability class.",
      },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="Marketplace"
      title="Standardised capacity, not spec sheets"
      state="in_progress"
      lede="Every listing carries a tier, a region, a reliability class, availability and an hourly price — and a live price estimate is always shown before anything deploys. The filterable grid over real listings lands in Phase 2."
    />
  ),
});
