import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/providers")({
  head: () => ({
    meta: [
      { title: "Providers — CorePort" },
      {
        name: "description",
        content:
          "List spare CPU, GPU, storage and bandwidth on CorePort, choose an availability mode and set your own payout floor.",
      },
      { property: "og:title", content: "Providers — CorePort" },
      { property: "og:description", content: "Your hardware. Your rate." },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="Providers"
      title="Your hardware. Your rate."
      state="planned"
      lede="Verification, availability modes, provider-set payout floors and the earnings estimator arrive in Phase 3. The estimator will show a gross monthly range per eligible product line — never a net-profit figure, and never a quote or promise of income."
    />
  ),
});
