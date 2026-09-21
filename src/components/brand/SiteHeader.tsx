import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Menu, X } from "lucide-react";

import { Wordmark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { lockSite } from "@/lib/site-gate.functions";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  { slug: "compute", label: "Compute" },
  { slug: "gpu", label: "GPU" },
  { slug: "storage", label: "Storage" },
  { slug: "games", label: "Games" },
  { slug: "node", label: "Node" },
  { slug: "api", label: "API" },
];

const SECTIONS = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/pricing", label: "Pricing" },
  { to: "/providers", label: "Providers" },
  { to: "/docs", label: "Docs" },
  { to: "/status", label: "Status" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(Boolean(session)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleLock() {
    await lockSite();
    await router.invalidate();
    router.navigate({ to: "/" });
  }

  const linkClass =
    "rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link to="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden flex-1 items-center gap-0.5 lg:flex">
          {PRODUCTS.slice(0, 4).map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              className={linkClass}
              activeProps={{ className: "text-foreground" }}
            >
              {p.label}
            </Link>
          ))}
          <span className="mx-2 h-4 w-px bg-border" />
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} className={linkClass} activeProps={{ className: "text-foreground" }}>
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLock}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline-flex"
          >
            <Lock className="h-3.5 w-3.5" />
            Lock
          </button>
          {signedIn ? (
            <Link
              to="/dashboard"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Account
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-border px-6 pb-4 pt-3 lg:hidden", open ? "block" : "hidden")}>
        <div className="grid grid-cols-2 gap-1">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              CorePort {p.label}
            </Link>
          ))}
          {SECTIONS.map((s) => (
            <Link key={s.to} to={s.to} onClick={() => setOpen(false)} className={linkClass}>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
