import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { Wordmark } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { Field } from "./login";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create an account — CorePort" },
      {
        name: "description",
        content:
          "Create a CorePort account for early access to rent infrastructure or list spare hardware.",
      },
      { property: "og:title", content: "Create an account — CorePort" },
      {
        property: "og:description",
        content: "Early access to the CorePort infrastructure marketplace.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    setBusy(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setDone(true);
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
        <p className="eyebrow">Early access</p>
        <h1 className="mt-3 text-3xl">Create an account</h1>

        {done ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-panel">
            <ShieldCheck className="h-5 w-5 text-state-healthy" />
            <h2 className="mt-3 text-base">Confirm your email</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We sent a confirmation link to {email}. Open it to finish setting up your account.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              Accounts are open while the rest of the site is in private build. You can rent capacity or
              apply to list hardware as each phase opens.
            </p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <Field label="Display name" type="text" value={displayName} onChange={setDisplayName} />
              <Field label="Email" type="email" value={email} autoComplete="email" onChange={setEmail} />
              <Field
                label="Password"
                type="password"
                value={password}
                autoComplete="new-password"
                onChange={setPassword}
                hint="At least 8 characters."
              />

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create account
              </button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                By creating an account you agree to the{" "}
                <Link to="/legal/$slug" params={{ slug: "terms" }} className="text-primary hover:underline">
                  customer terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/legal/$slug"
                  params={{ slug: "acceptable-use" }}
                  className="text-primary hover:underline"
                >
                  acceptable use policy
                </Link>
                .
              </p>
            </form>
          </>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
