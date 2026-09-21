import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Wordmark } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — CorePort" },
      { name: "description", content: "Sign in to your CorePort account with a password or a magic link." },
      { property: "og:title", content: "Sign in — CorePort" },
      { property: "og:description", content: "Sign in to your CorePort account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.navigate({ to: "/" });
  }

  async function magicLink() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: linkError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (linkError) {
      setError(linkError.message);
      return;
    }
    setNotice("Check your inbox — we sent you a sign-in link.");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-md px-6 py-4">
          <Link to="/">
            <Wordmark />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-md flex-1 px-6 py-16">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 text-3xl">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Signing in is open during private build. Site access still needs the build password.
        </p>

        <form onSubmit={signIn} className="mt-8 space-y-4">
          <Field
            label="Email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={setEmail}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={setPassword}
          />

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {notice ? <p className="text-sm text-state-healthy">{notice}</p> : null}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
          <button
            type="button"
            onClick={magicLink}
            disabled={busy}
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            Email me a sign-in link
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          No account yet?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  hint,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        required
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}
