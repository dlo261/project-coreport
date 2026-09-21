import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Milestone = {
  id: string;
  title: string;
  detail: string | null;
  state: string;
};

export const getMilestones = createServerFn({ method: "GET" }).handler(async (): Promise<Milestone[]> => {
  const { publicDbClient } = await import("./public-data.server");
  const { data, error } = await publicDbClient()
    .from("build_milestones")
    .select("id,title,detail,state")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getLegalPage = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const { publicDbClient } = await import("./public-data.server");
    const { data: row, error } = await publicDbClient()
      .from("legal_pages")
      .select("slug,title,body,updated_at")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
