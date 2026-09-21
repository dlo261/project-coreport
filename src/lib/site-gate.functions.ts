import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getGateState = createServerFn({ method: "GET" }).handler(async () => {
  const { isUnlocked } = await import("./site-gate.server");
  return { unlocked: await isUnlocked() };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }) => {
    const { tryUnlock } = await import("./site-gate.server");
    const ok = await tryUnlock(data.password);
    return { ok };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const { lock } = await import("./site-gate.server");
  await lock();
  return { ok: true };
});
