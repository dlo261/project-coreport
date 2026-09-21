import { getSession, updateSession, clearSession } from "@tanstack/react-start/server";

const GATE_COOKIE = "coreport_gate";

function requireSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short for signing the session cookie.");
  }
  return secret;
}

function gateConfig() {
  return {
    password: requireSecret(),
    name: GATE_COOKIE,
    maxAge: 60 * 60 * 24 * 14,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return new Uint8Array(digest);
}

/** Constant-time comparison over SHA-256 digests of both values. */
async function constantTimeEquals(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = ha.length ^ hb.length;
  for (let i = 0; i < ha.length; i++) {
    diff |= (ha[i] ?? 0) ^ (hb[i] ?? 0);
  }
  return diff === 0;
}

export async function isUnlocked(): Promise<boolean> {
  const session = await getSession<{ unlocked?: boolean }>(gateConfig());
  return session.data.unlocked === true;
}

export async function tryUnlock(submitted: string): Promise<boolean> {
  const expected = process.env["SITE_PASSWORD"];
  if (!expected) {
    throw new Error("SITE_PASSWORD is not configured for this environment.");
  }
  // The submitted value is only ever compared here, on the server.
  const ok = await constantTimeEquals(submitted, expected);
  if (!ok) return false;
  await updateSession(gateConfig(), { unlocked: true });
  return true;
}

export async function lock(): Promise<void> {
  await clearSession(gateConfig());
}
