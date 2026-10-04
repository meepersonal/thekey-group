import { Link } from "@/lib/router";
import {
  Car,
  ClipboardList,
  Ship,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Package,
  Eye,
  Users,
  MousePointerClick,
  Clock,
  Building2,
  ExternalLink,
  Phone,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeading } from "@/components/admin/admin-shell";
import { OrderStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import {
  fcfa,
  orderTotal,
  usePreorders,
  useAgences,
  useDashboardStats,
  useStatsOverview,
  type Preorder,
} from "@/data/admin-store";

// ─────────────────────────────────────────────
// KPI Card
// ─────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  accent = "navy",
}: {
  icon: typeof Car;
  label: string;
  value: string;
  hint: string;
  trend?: { value: string; positive?: boolean } | undefined;
  accent?: "navy" | "accent" | "emerald" | "amber" | "sky";
}) {
  const accents = {
    navy: "bg-gradient-navy text-navy-foreground",
    accent: "bg-gradient-accent text-accent-foreground",
    emerald: "bg-emerald-500/15 text-emerald-600",
    amber: "bg-amber-500/15 text-amber-600",
    sky: "bg-sky-500/15 text-sky-600",
  };

  return (
    <div className="surface-card group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-150"
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">{value}</p>

          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{hint}</p>
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  trend.positive
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {trend.positive ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5" />
                )}
                {trend.value}
              </span>
            )}
          </div>
        </div>

        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accents[accent]} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section Card
// ─────────────────────────────────────────────
function SectionCard({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`surface-card flex flex-col p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-bold">{title}</h2>
        {action}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatDuration = (seconds: number) => {
  if (!seconds || seconds < 60) return `${Math.round(seconds || 0)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
export function AdminDashboard() {
  const { data: preordersData } = usePreorders({ page: "1", per_page: "5" });
  const { data: statsData } = useStatsOverview(6);
  const { data: dashboard } = useDashboardStats(6);
  const { data: agences } = useAgences();

  const orders: Preorder[] = preordersData?.data ?? [];
  const orderTotalCount = preordersData?.meta?.total ?? 0;

  const vehiclesStats = dashboard?.vehicles;
  const preordersStats = dashboard?.preorders;
  const revenueStats = dashboard?.revenue;
  const containersStats = dashboard?.containers;
  const byBrand = dashboard?.by_brand ?? [];
  const byMonth = dashboard?.by_month ?? [];
  const activeAgences = (agences ?? []).filter((a) => a.is_active);

  const trend = (value: number | null | undefined) =>
    value === null || value === undefined
      ? undefined
      : {
          value: `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
          positive: value >= 0,
        };

  // Calculs pages views (données réelles)
  const stats = statsData;
  const totalViews = stats?.totals.views ?? 0;
  const totalVisitors = stats?.totals.visitors ?? 0;
  const totalClicks = stats?.totals.clicks ?? 0;
  const avgDuration = stats?.totals.avg_duration_seconds ?? 0;
  const viewsChange = stats?.totals.views_change_pct ?? 0;
  const conversionRate =
    totalVisitors > 0 ? ((preordersStats?.active ?? 0) / totalVisitors) * 100 : 0;
  const timeline = stats?.timeline ?? [];
  const topPages = stats?.top_pages ?? [];

  return (
    <div className="space-y-6">
      <PageHeading
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité — catalogue, précommandes, trafic et agences."
      />

      {/* KPIs principaux */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Car}
          label="Véhicules au catalogue"
          value={`${vehiclesStats?.total ?? 0}`}
          hint={`${vehiclesStats?.in_stock ?? 0} en stock · ${vehiclesStats?.on_order ?? 0} sur commande`}
          trend={trend(vehiclesStats?.change_pct)}
          accent="navy"
        />
        <KpiCard
          icon={ClipboardList}
          label="Précommandes en cours"
          value={`${preordersStats?.active ?? 0}`}
          hint={`${preordersStats?.new ?? 0} nouvelles · ${orderTotalCount} au total`}
          trend={trend(preordersStats?.change_pct)}
          accent="accent"
        />
        <KpiCard
          icon={Ship}
          label="Conteneurs en transit"
          value={`${containersStats?.in_transit ?? 0}`}
          hint={`${containersStats?.total ?? 0} dossiers suivis`}
          accent="emerald"
        />
        <KpiCard
          icon={Wallet}
          label="CA estimé"
          value={fcfa(revenueStats?.total ?? 0)}
          hint={`${fcfa(revenueStats?.month ?? 0)} ce mois-ci`}
          trend={trend(revenueStats?.change_pct)}
          accent="amber"
        />
      </div>

      {/* KPIs Pages Views */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Eye}
          label="Consultations (6 mois)"
          value={new Intl.NumberFormat("fr-FR").format(totalViews)}
          hint="Fiches véhicules vues"
          trend={
            viewsChange === null
              ? undefined
              : {
                  value: `${viewsChange >= 0 ? "+" : ""}${viewsChange.toFixed(1)}%`,
                  positive: viewsChange >= 0,
                }
          }
          accent="sky"
        />
        <KpiCard
          icon={Users}
          label="Visiteurs uniques"
          value={new Intl.NumberFormat("fr-FR").format(totalVisitors)}
          hint="Sessions dédupliquées"
          accent="navy"
        />
        <KpiCard
          icon={Clock}
          label="Temps moyen / page"
          value={formatDuration(avgDuration)}
          hint="Temps d'affichage moyen"
          accent="emerald"
        />
        <KpiCard
          icon={MousePointerClick}
          label="Clics enregistrés"
          value={new Intl.NumberFormat("fr-FR").format(totalClicks)}
          hint={`${stats?.totals.clicks_per_view ?? 0} clic / vue`}
          accent="accent"
        />
      </div>

      {/* Graphique Pages Views + Top pages */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard
          title="Trafic du site"
          action={
            <span className="text-xs font-medium text-muted-foreground">6 derniers mois</span>
          }
          className="xl:col-span-2"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--navy)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--navy)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Pages vues"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visiteurs"
                  stroke="var(--navy)"
                  strokeWidth={2}
                  fill="url(#visitorsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Légende custom */}
          <div className="mt-3 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-muted-foreground">Pages vues</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--navy)" }} />
              <span className="text-muted-foreground">Visiteurs uniques</span>
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Véhicules les plus vus">
          <div className="space-y-2">
            {topPages.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Aucune consultation enregistrée pour le moment.
              </p>
            ) : (
              topPages.map((page, i) => (
                <Link
                  key={page.vehicle_id}
                  to={`/admin/catalogue?vehicle=${page.vehicle_id}`}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-secondary/40"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-secondary text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium">{page.label}</span>
                      <span className="block text-[10px] text-muted-foreground">
                        {formatDuration(page.avg_duration_seconds)} moyen ·{" "}
                        {new Intl.NumberFormat("fr-FR").format(page.clicks)} clics
                      </span>
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-bold">
                      {new Intl.NumberFormat("fr-FR").format(page.views)}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* Graphique précommandes + Répartition marques */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionCard title="Répartition par marque">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBrand}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={26} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--navy)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard
          title="Agences & points de retrait"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {activeAgences.length} active(s)
            </span>
          }
          className="xl:col-span-2"
        >
          {activeAgences.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Aucune agence active. Ajoutez-la depuis Paramètres.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {activeAgences.map((agency) => (
                <div
                  key={agency.id}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl transition-transform duration-500 group-hover:scale-150"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-navy text-navy-foreground">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{agency.name}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {agency.location}
                        </p>
                      </div>
                    </div>

                    {agency.map_url ? (
                      <a
                        href={agency.map_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Voir ${agency.name} sur la carte`}
                        className="shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    ) : null}
                  </div>

                  <div className="relative mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{agency.phone || "—"}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {agency.hours || "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Commandes & revenus */}
      <SectionCard
        title="Commandes & revenus"
        action={<span className="text-xs font-medium text-muted-foreground">6 derniers mois</span>}
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                yAxisId="revenue"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={58}
                tickFormatter={(v: number) => `${Math.round(v / 1_000_000)}M`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) =>
                  name === "revenue" ? [fcfa(value), "Revenus"] : [value, "Commandes"]
                }
              />
              <Bar
                yAxisId="orders"
                dataKey="orders"
                name="orders"
                fill="var(--navy)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                name="revenue"
                fill="url(#revenueGradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--navy)" }} />
            <span className="text-muted-foreground">Commandes</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-muted-foreground">Revenus (FCFA)</span>
          </span>
          <span className="ml-auto text-muted-foreground">
            Taux de conversion trafic → commande :{" "}
            <span className="font-semibold text-foreground">{conversionRate.toFixed(1)}%</span>
          </span>
        </div>
      </SectionCard>

      {/* Dernières précommandes */}
      <SectionCard
        title="Dernières précommandes"
        action={
          <Button asChild variant="outline" size="sm" className="group/btn">
            <Link to="/admin/precommandes">
              Tout voir
              <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </Button>
        }
      >
        <div className="space-y-2">
          {orders.slice(0, 5).map((o) => (
            <Link
              key={o.id}
              to="/admin/precommandes"
              className="group/item flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/40 hover:shadow-sm"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-navy text-xs font-bold text-navy-foreground">
                  {o.client_name?.charAt(0).toUpperCase() ?? "?"}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {o.client_name} ·{" "}
                    <span className="text-muted-foreground">
                      {o.vehicle ? `${o.vehicle.brand} ${o.vehicle.model}` : "—"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {o.reference} · {new Date(o.created_at ?? "").toLocaleDateString("fr-FR")} ·{" "}
                    <span className="font-semibold text-foreground">{fcfa(orderTotal(o))}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <OrderStatusBadge status={o.status} />
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100" />
              </div>
            </Link>
          ))}

          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-10 text-center">
              <Package className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Aucune précommande pour le moment</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
