import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Ship, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/tracking", label: "Tracking Conteneur" },
  { to: "/a-propos", label: "À Propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-navy text-navy-foreground">
            <Ship className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-extrabold tracking-tight">
              AutoTrack Bénin
            </span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">
              Chinese Auto Imports
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-accent" }}
              inactiveProps={{ className: "text-foreground/75" }}
              className="rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild variant="accent" size="default" className="ml-2">
            <Link to="/tracking" search={{ code: "" }}>
              <Search className="h-4 w-4" />
              Rechercher un conteneur
            </Link>
          </Button>
        </nav>

        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-in slide-in-from-top-2 border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-secondary text-accent" }}
                className="rounded-lg px-3 py-3 text-sm font-semibold"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="accent" size="lg" className="mt-2">
              <Link to="/tracking" search={{ code: "" }} onClick={() => setOpen(false)}>
                <Search className="h-4 w-4" />
                Rechercher un conteneur
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
