import { Link } from "@tanstack/react-router";

const LEGAL = [
  { slug: "terms", label: "Terms" },
  { slug: "privacy", label: "Privacy" },
  { slug: "acceptable-use", label: "Acceptable use" },
  { slug: "provider-agreement", label: "Provider agreement" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CorePort</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL.map((item) => (
            <Link
              key={item.slug}
              to="/legal/$slug"
              params={{ slug: item.slug }}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
