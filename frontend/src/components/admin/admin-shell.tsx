import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Ship,
  Settings,
  Bell,
  Search,
  Plus,
  Menu,
  ChevronLeft,
  LogOut,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_NOTIFICATIONS } from "@/data/admin-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/catalogue", label: "Gestion du Catalogue", icon: Car, exact: false },
  { to: "/admin/precommandes", label: "Précommandes & Prospects", icon: ClipboardList, exact: false },
  { to: "/admin/conteneurs", label: "Suivi des Conteneurs", icon: Ship, exact: false },
  { to: "/admin/parametres", label: "Configuration", icon: Settings, exact: false },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const nav = (onClick?: () => void) => (
    <nav className="flex flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            title={item.label}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground",
            )}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-secondary/60">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-gradient-navy py-4 text-navy-foreground transition-all duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-72",
        )}
      >
        <div className="mb-6 flex items-center gap-3 px-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            <Ship className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold">
                AutoTrack Bénin
              </span>
              <span className="block text-[11px] text-navy-foreground/60">Back-Office</span>
            </span>
          )}
        </div>
        {nav()}
        <div className="mt-auto px-3">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-foreground/70 hover:bg-navy-foreground/10"
          >
            <ChevronLeft className={cn("h-[18px] w-[18px] transition", collapsed && "rotate-180")} />
            {!collapsed && "Réduire le menu"}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-gradient-navy py-4 text-navy-foreground">
            <div className="mb-6 flex items-center gap-3 px-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Ship className="h-5 w-5" />
              </span>
              <span className="font-display text-sm font-extrabold">AutoTrack — Admin</span>
            </div>
            {nav(() => setMobileOpen(false))}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden min-w-0 flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un véhicule, un client, un conteneur…"
                className="pl-9"
              />
            </div>
            <div className="flex-1 md:hidden" />

            <Button asChild variant="accent" className="hidden sm:inline-flex">
              <Link to="/admin/catalogue" search={{ new: true }}>
                <Plus className="h-4 w-4" />
                Ajouter un véhicule
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                    {ADMIN_NOTIFICATIONS.length}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ADMIN_NOTIFICATIONS.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5">
                    <span className="text-sm font-medium">{n.text}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-2 py-1.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-navy text-xs font-bold text-navy-foreground">
                    JS
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-xs font-bold">Junior SANNI</span>
                    <span className="block text-[11px] text-muted-foreground">Administrateur</span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Junior SANNI</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserRound className="h-4 w-4" /> Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/parametres">
                    <Settings className="h-4 w-4" /> Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/">
                    <LogOut className="h-4 w-4" /> Retour au site
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
