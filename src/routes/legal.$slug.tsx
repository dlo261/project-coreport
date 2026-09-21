import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SiteFooter } from "@/components/brand/SiteFooter";
import { Wordmark } from "@/components/brand/Logo";
import { getLegalPage } from "@/lib/content.functions";

export const Route = createFileRoute("/legal/$slug")({
  loader: async ({ params }) => {
    const page = await getLegalPage({ data: { slug: params.slug } });
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — CorePort" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.page.title} — CorePort`;
    const description = `${loaderData.page.title} for CorePort infrastructure products.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LegalPage,
});

function LegalPage() {
  const { page } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl px-6 py-4">
          <Link to="/">
            <Wordmark />
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">{page.title}</h1>
        <p className="technical mt-3 text-xs text-muted-foreground">
          Last updated {new Date(page.updated_at).toISOString().slice(0, 10)}
        </p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {page.body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
