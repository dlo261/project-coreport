import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/download")({
  head: () => ({
    meta: [
      { title: "Download CorePort Node — CorePort" },
      {
        name: "description",
        content:
          "Download the CorePort Node agent per operating system, with version, changelog, checksum and system requirements.",
      },
      { property: "og:title", content: "Download CorePort Node — CorePort" },
      { property: "og:description", content: "The provider-side agent that turns hardware into earnings." },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="CorePort Node"
      title="Download centre"
      state="planned"
      lede="Per-OS cards with version, release date, changelog, file size, SHA-256 checksum, signing note and system requirements — drawn from the same tier configuration the estimator reads. Built in Phase 2, once the agent has a signed release to publish."
    />
  ),
});
