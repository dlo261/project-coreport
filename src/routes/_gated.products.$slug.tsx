import { createFileRoute, notFound } from "@tanstack/react-router";

import { PhasePanel } from "@/components/brand/PhasePanel";

const PRODUCTS: Record<string, { name: string; lede: string; state: string; eyebrow: string }> = {
  compute: {
    name: "CorePort Compute",
    eyebrow: "On-demand compute",
    state: "in_progress",
    lede: "General-purpose compute rented by the hour, drawn from peer hardware and presented as a tier, a region and a reliability class rather than a machine.",
  },
  gpu: {
    name: "CorePort GPU",
    eyebrow: "AI and render capacity",
    state: "in_progress",
    lede: "GPU capacity for training, inference and render work, grouped by VRAM class and model so a workload can target what it actually needs.",
  },
  storage: {
    name: "CorePort Storage",
    eyebrow: "Distributed storage",
    state: "planned",
    lede: "Distributed storage billed on what you hold, spread across peer capacity by storage and network tier.",
  },
  games: {
    name: "CorePort Games",
    eyebrow: "Game server hosting",
    state: "planned",
    lede: "Game server hosting on low-latency peer capacity, priced against the hosts people already compare us to.",
  },
  node: {
    name: "CorePort Node",
    eyebrow: "Provider agent",
    state: "in_progress",
    lede: "The provider-side agent. It benchmarks a machine, reports heartbeats and usage, and runs customer workloads in isolation. The agent itself is a separate backend service; this site is where you download it and watch what it earns.",
  },
  api: {
    name: "CorePort API",
    eyebrow: "Programmatic access",
    state: "planned",
    lede: "Programmatic access to listings, quotes, deployments, billing and provider endpoints, authenticated with scoped API keys.",
  },
};

export const Route = createFileRoute("/_gated/products/$slug")({
  loader: ({ params }) => {
    const product = PRODUCTS[params.slug];
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Unavailable — CorePort" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.product.name} — CorePort`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.product.lede },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.product.lede },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  return (
    <PhasePanel
      eyebrow={product.eyebrow}
      title={product.name}
      state={product.state}
      lede={product.lede}
    />
  );
}
