import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, KeyRound, Loader2 } from "lucide-react";

import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";
import { StateBadge } from "@/components/brand/StateBadge";
import { getMilestones, type Milestone } from "@/lib/content.functions";
import { getGateState, unlockSite } from "@/lib/site-gate.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CorePort — Compute. Storage. Anywhere." },
      {
        name: "description",
        content:
          "CorePort is an infrastructure marketplace that rents compute, GPU, storage and game servers from independent hardware. Currently in private build.",
      },
      { property: "og:title", content: "CorePort — Compute. Storage. Anywhere." },
      {
        property: "og:description",
        content: "Cloud infrastructure powered by hardware everywhere. Currently in private build.",
      },
    ],
  }),
  loader: async () => {
    const [gate, milestones] = await Promise.all([getGateState(), getMilestones()]);
    return { unlocked: gate.unlocked, milestones };
  },
  component: Home,
});

function Home() {
  const { unlocked, milestones } = Route.useLoaderData();
  return unlocked ? <UnlockedHome /> : <ComingSoon milestones={milestones} />;
}

/* ------------------------------ locked front door ------------------------------ */

const STEPS = [
  {
    title: "Providers register hardware",
    body: "The CorePort Node agent benchmarks a machine's CPU, GPU, storage and network, then assigns it tiers from those measurements.",
  },
  {
    title: "CorePort standardises it",
    body: "Heterogeneous machines become comparable products, each with a tier, a region and a reliability class instead of a spec sheet.",
  },
  {
    title: "Customers buy a product",
    body: "A customer rents compute, GPU capacity, storage or a game server. They never pick, see or manage an individual host.",
  },
];

function ComingSoon({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Wordmark />
          <UnlockControl />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="rule-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
          <div className="relative mx-auto max-w-4xl px-6 py-24 sm:py-32">
            <p className="eyebrow">Coming soon</p>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-6xl">Compute. Storage. Anywhere.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              CorePort is an infrastructure marketplace. People with spare hardware list idle CPU, GPU,
              storage and bandwidth; customers rent standardised infrastructure products built from it —
              without the hyperscaler markup. The platform is in private build, so most of the site is
              closed while we finish it.
            </p>
            <p className="technical mt-6 text-sm text-muted-foreground">
              Cloud infrastructure powered by hardware everywhere.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="text-2xl sm:text-3xl">The network is the data center.</h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <span className="technical text-sm text-primary">0{i + 1}</span>
                  <h3 className="mt-3 text-base">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-2xl border-l-2 border-border pl-5 text-sm leading-relaxed text-muted-foreground">
              CorePort will not own most of the hardware it schedules. An individual host is never exposed
              to a customer — the platform matches a purchased product to capacity that qualifies for it,
              and retains a configurable percentage of each completed transaction. Reliability figures
              published anywhere on this site are engineering targets, not service guarantees.
            </p>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <h2 className="text-2xl sm:text-3xl">What&apos;s built so far</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              An honest state of the build. Updated as pieces land.
            </p>
            <ul className="mt-10 divide-y divide-border border-y border-border">
              {milestones.map((m) => (
                <li key={m.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:gap-6">
                  <StateBadge state={m.state} className="sm:mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{m.title}</p>
                    {m.detail ? (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.detail}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="flex flex-col items-start gap-6 rounded-xl border border-border bg-card p-8 shadow-panel sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl">Join early access</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Create an account now and you&apos;ll be able to rent capacity or list hardware as each
                  phase opens up. No password needed to sign up.
                </p>
              </div>
              <Link
                to="/signup"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function UnlockControl() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await unlockSite({ data: { password } });
      if (result.ok) {
        setPassword("");
        await router.invalidate();
      } else {
        setError("That password isn't right.");
      }
    } catch {
      setError("Couldn't check that right now. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <KeyRound className="h-3.5 w-3.5" />
        Have a password?
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <input
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Site password"
          aria-label="Site password"
          aria-invalid={error ? true : undefined}
          className="h-9 w-40 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-48"
        />
        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Unlock
        </button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </form>
  );
}

/* ------------------------------ unlocked home ------------------------------ */

const SUITE = [
  { slug: "compute", name: "CorePort Compute", blurb: "On-demand general compute, priced by the hour." },
  { slug: "gpu", name: "CorePort GPU", blurb: "GPU capacity for AI training, inference and render work." },
  { slug: "storage", name: "CorePort Storage", blurb: "Distributed storage billed on what you actually hold." },
  { slug: "games", name: "CorePort Games", blurb: "Game server hosting on low-latency peer capacity." },
  { slug: "node", name: "CorePort Node", blurb: "The provider agent that turns spare hardware into earnings." },
  { slug: "api", name: "CorePort API", blurb: "Programmatic access to every product above." },
];

function UnlockedHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="rule-grid pointer-events-none absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24">
            <p className="eyebrow">Infrastructure without the hyperscaler markup</p>
            <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] sm:text-6xl">
              Compute. Storage. Anywhere.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Independent hardware. One infrastructure network. Rent standardised products by tier, region
              and reliability class — or list your own hardware and set your own rate.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/marketplace"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Browse the marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/providers"
                className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Your hardware. Your rate.
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl">The product suite</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUITE.map((item) => (
              <Link
                key={item.slug}
                to="/products/$slug"
                params={{ slug: item.slug }}
                className="group rounded-xl border border-border bg-card p-6 shadow-panel transition-shadow hover:shadow-lift"
              >
                <LogoMark className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-base">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.blurb}</p>
                <span className="technical mt-4 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
