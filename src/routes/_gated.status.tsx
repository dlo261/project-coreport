import { createFileRoute } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

export const Route = createFileRoute("/_gated/status")({
  head: () => ({
    meta: [
      { title: "Status — CorePort" },
      {
        name: "description",
        content: "Component status and incident history for the CorePort network.",
      },
      { property: "og:title", content: "Status — CorePort" },
      { property: "og:description", content: "Component status and incident history." },
    ],
  }),
  component: () => (
    <PhasePanel
      eyebrow="Status"
      title="Component status"
      state="in_progress"
      lede="Component states and incident history are editable content rather than hardcoded copy, so an incident can be posted without a redeploy. Until a real fleet reports in, anything shown here is illustrative."
    />
  ),
});
