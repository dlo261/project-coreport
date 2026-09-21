import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { getGateState } from "@/lib/site-gate.functions";

/**
 * Server-side gate. This runs before any gated route loads — including for a
 * plain HTTP request that follows no JavaScript — so typing a gated path
 * directly redirects to the public front door when the session is locked.
 */
export const Route = createFileRoute("/_gated")({
  beforeLoad: async () => {
    const { unlocked } = await getGateState();
    if (!unlocked) {
      throw redirect({ to: "/" });
    }
  },
  component: GatedLayout,
});

function GatedLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
