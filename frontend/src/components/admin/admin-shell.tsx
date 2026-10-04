import { useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@/lib/router";
import {
  LayoutDashboard,
  Car,
  ClipboardList,
  Ship,
  Settings,
  BarChart3,
  Users,
  Menu,
  ChevronLeft,
  LogOut,
  UserRound,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/catalogue", label: "Gestion du Catalogue", icon: Car, exact: false },
  {
    to: "/admin/precommandes",
    label: "Précommandes & Prospects",
    icon: ClipboardList,
    exact: false,
  },
  { to: "/admin/conteneurs", label: "Suivi des Conteneurs", icon: Ship, exact: false },
  { to: "/admin/statistiques", label: "Statistiques", icon: BarChart3, exact: false },
  { to: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, exact: false },
  { to: "/admin/parametres", label: "Configuration", icon: Settings, exact: false },
] as const;

// URL du site vitrine
const SITE_URL = import.meta.env.VITE_SITE_URL;

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState((s) => s.pathname);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
      toast.success("Déconnexion réussie.");
    } catch {
      // ignore
    }
  };

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
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              active
                ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground",
            )}
          >
            {active && (
              <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-navy-foreground/90" />
            )}
            <item.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                !active && "group-hover:scale-110",
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const userInitials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "JS";

  return (
    <div className="flex min-h-screen bg-secondary/60">
      {/* ============ SIDEBAR DESKTOP ============ */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-gradient-navy py-5 text-navy-foreground shadow-xl shadow-navy/10 transition-all duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-72",
        )}
      >
        {/* Logo */}
        <div
          className={cn("mb-8 flex items-center gap-3 px-5", collapsed && "justify-center px-0")}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground shadow-md shadow-accent/30">
            <Ship className="h-5 w-5" />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate font-display text-sm font-extrabold">
                {import.meta.env.VITE_WEBSITE_NAME}
              </span>
              <span className="block text-[11px] text-navy-foreground/60">Back-Office</span>
            </span>
          )}
        </div>

        {nav()}

        {/* Bouton "Voir le site vitrine" */}
        <div className="mt-6 px-3">
          <div className="mb-3 h-px bg-navy-foreground/10" />
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Voir le site vitrine"
            className={cn(
              "group flex items-center gap-3 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-2.5 text-sm font-semibold text-navy-foreground/80 transition-all duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-navy-foreground",
              collapsed && "justify-center",
            )}
          >
            <ExternalLink className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && (
              <>
                <span className="truncate">Voir le site</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-navy-foreground/50">
                  ↗
                </span>
              </>
            )}
          </a>
        </div>

        {/* Collapse toggle */}
        <div className="mt-auto px-3">
          <div className="mb-3 h-px bg-navy-foreground/10" />
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-foreground/70 transition hover:bg-navy-foreground/10 hover:text-navy-foreground",
              collapsed && "justify-center",
            )}
          >
            <ChevronLeft
              className={cn(
                "h-[18px] w-[18px] transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
            {!collapsed && "Réduire le menu"}
          </button>
        </div>
      </aside>

      {/* ============ MOBILE DRAWER ============ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-gradient-navy py-5 text-navy-foreground shadow-2xl">
            <div className="mb-6 flex items-center justify-between px-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Ship className="h-5 w-5" />
                </span>
                <span className="font-display text-sm font-extrabold">AutoTrack — Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-navy-foreground/70 transition hover:bg-navy-foreground/10 hover:text-navy-foreground"
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav(() => setMobileOpen(false))}

            {/* Bouton "Voir le site vitrine" (mobile) */}
            <div className="mt-6 px-3">
              <div className="mb-3 h-px bg-navy-foreground/10" />
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-3 rounded-xl border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-2.5 text-sm font-semibold text-navy-foreground/80 transition-all duration-200 hover:border-accent/40 hover:bg-accent/10 hover:text-navy-foreground"
              >
                <ExternalLink className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="truncate">Voir le site</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-navy-foreground/50">
                  ↗
                </span>
              </a>
            </div>
          </aside>
        </div>
      )}

      {/* ============ CONTENU PRINCIPAL ============ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <button
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border transition hover:bg-secondary lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden min-w-0 flex-1 md:block">
              <span className="text-sm font-semibold text-muted-foreground">
                Espace administrateur
              </span>
            </div>

            {/* Bouton "Voir le site" (header, desktop) */}
            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:text-foreground md:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
              Voir le site vitrine
            </a>

            {/* Profil utilisateur */}
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-background px-2.5 py-1.5 transition hover:bg-secondary">
                    <span className="relative grid h-8 w-8 place-items-center rounded-lg bg-gradient-navy text-xs font-bold text-navy-foreground">
                      {userInitials}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                    </span>
                    <span className="hidden text-left leading-tight sm:block">
                      <span className="block text-xs font-bold">{user?.name ?? "—"}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        Administrateur
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>{user?.name ?? "—"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg">
                    <UserRound className="h-4 w-4" /> Mon profil
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/admin/parametres">
                      <Settings className="h-4 w-4" /> Paramètres
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Option : Voir le site dans le menu profil */}
                  <DropdownMenuItem asChild className="rounded-lg">
                    <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Voir le site vitrine
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => handleLogout()}
                    className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700"
                  >
                    <LogOut className="h-4 w-4" /> Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
