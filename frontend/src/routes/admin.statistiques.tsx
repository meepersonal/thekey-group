import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
  CalendarIcon,
  X,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { PageHeading } from "@/components/admin/admin-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStatsOverview } from "@/data/admin-store";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   PALETTE VERTE
   ═══════════════════════════════════════════════════════════ */
const PIE_COLORS = [
  "#059669", // emerald-600
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#a7f3d0", // emerald-200
];

const GREEN_PRIMARY = "#059669";   // emerald-600
const GREEN_SECONDARY = "#34d399"; // emerald-400
const GREEN_LIGHT = "#a7f3d0";     // emerald-200

const PERIOD_PRESETS = [
  { value: "3", label: "3 derniers mois" },
  { value: "6", label: "6 derniers mois" },
  { value: "12", label: "12 derniers mois" },
];

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const formatDay = (date: Date) => date.toLocaleDateString("fr-FR");

const formatDuration = (seconds: number) => {
  if (!seconds || seconds < 60) return `${Math.round(seconds || 0)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

export function AdminStats() {
  const [preset, setPreset] = useState("6");
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(undefined);
  const [appliedRange, setAppliedRange] = useState<{ from: string; to: string } | null>(null);
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  const params = useMemo(
    () =>
      appliedRange ? { from: appliedRange.from, to: appliedRange.to } : { months: Number(preset) },
    [appliedRange, preset],
  );

  const { data, isLoading, isFetching } = useStatsOverview(params);

  const totals = data?.totals;
  const points = data?.timeline ?? [];
  const topVehicles = data?.top_pages ?? [];
  const change = totals?.views_change_pct ?? null;
  const range = data?.range;
  const isDaily = range?.granularity === "day";

  const rangeLabel = appliedRange
    ? `${formatDay(new Date(`${appliedRange.from}T00:00:00`))} → ${formatDay(
      new Date(`${appliedRange.to}T00:00:00`),
    )}`
    : PERIOD_PRESETS.find((p) => p.value === preset)?.label;

  const handlePresetChange = (value: string) => {
    setPreset(value);
    setAppliedRange(null);
    setDraftRange(undefined);
  };

  const applyRange = () => {
    if (!draftRange?.from) return;
    const from = toISODate(draftRange.from);
    const to = draftRange.to ? toISODate(draftRange.to) : from;
    setAppliedRange({ from, to });
    setIsRangeOpen(false);
  };

  const clearRange = () => {
    setAppliedRange(null);
    setDraftRange(undefined);
    setIsRangeOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeading title="Statistiques" subtitle="Trafic des fiches véhicules." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-secondary/60" />
      </div>
    );
  }

  const hasData = (totals?.views ?? 0) > 0;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Statistiques"
        subtitle="Consultations, temps d'affichage et clics sur les fiches véhicules."
      />

      <div className="surface-card flex flex-wrap items-end gap-3 p-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Période
          </label>
          <Select
            value={appliedRange ? "custom" : preset}
            onValueChange={(value) => {
              if (value === "custom") {
                setIsRangeOpen(true);
                return;
              }
              handlePresetChange(value);
            }}
          >
            <SelectTrigger className="w-[220px]" aria-label="Période">
              <SelectValue placeholder="Choisir une période" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
              <SelectItem value="custom">Plage personnalisée…</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Entre deux dates
          </span>
          <Popover open={isRangeOpen} onOpenChange={setIsRangeOpen}>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: appliedRange ? "default" : "outline" }),
                "w-[260px] justify-start text-left font-normal",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {draftRange?.from ? (
                <span className="truncate">
                  {formatDay(draftRange.from)}
                  {draftRange.to ? ` → ${formatDay(draftRange.to)}` : "…"}
                </span>
              ) : appliedRange ? (
                <span className="truncate">{rangeLabel}</span>
              ) : (
                <span className="text-muted-foreground">Choisir les dates</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3">
                <Calendar
                  mode="range"
                  selected={draftRange}
                  onSelect={setDraftRange}
                  disabled={{ after: new Date() }}
                  numberOfMonths={2}
                  {...(draftRange?.from ? { defaultMonth: draftRange.from } : {})}
                />
                <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                  <p className="text-xs text-muted-foreground">
                    {!draftRange?.from
                      ? "Sélectionnez la date de début"
                      : draftRange.to
                        ? `${formatDay(draftRange.from)} → ${formatDay(draftRange.to)}`
                        : "Choisissez la date de fin"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearRange}
                      disabled={!appliedRange && !draftRange?.from}
                    >
                      Réinitialiser
                    </Button>
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={applyRange}
                      disabled={!draftRange?.from}
                    >
                      Appliquer
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="ml-auto flex items-center gap-2 pb-1 text-xs text-muted-foreground">
          {isFetching && !isLoading && <span>Mise à jour…</span>}
          <span>
            {rangeLabel}
            {range
              ? ` · ${range.days} jour(s) · agrégation ${isDaily ? "par jour" : "par mois"}`
              : ""}
          </span>
          {appliedRange && (
            <Button size="sm" variant="ghost" onClick={clearRange} aria-label="Effacer la plage">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Eye}
          label="Consultations"
          value={new Intl.NumberFormat("fr-FR").format(totals?.views ?? 0)}
          change={change}
        />
        <StatTile
          icon={Users}
          label="Visiteurs uniques"
          value={new Intl.NumberFormat("fr-FR").format(totals?.visitors ?? 0)}
        />
        <StatTile
          icon={Clock}
          label="Temps moyen / page"
          value={formatDuration(totals?.avg_duration_seconds ?? 0)}
        />
        <StatTile
          icon={MousePointerClick}
          label="Clics enregistrés"
          value={new Intl.NumberFormat("fr-FR").format(totals?.clicks ?? 0)}
          hint={`${totals?.clicks_per_view ?? 0} clic / vue`}
        />
      </div>

      {!hasData ? (
        <div className="surface-card px-6 py-20 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Eye className="h-5 w-5" />
          </span>
          <p className="mt-4 font-display text-base font-bold">Aucune donnée pour le moment</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Les statistiques apparaîtront dès que des visiteurs consulteront une fiche véhicule.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-3">
            {/* Courbe de trafic */}
            <div className="surface-card p-5 xl:col-span-2">
              <h3 className="text-sm font-semibold">Évolution du trafic</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Consultations et visiteurs uniques {isDaily ? "par jour" : "par mois"}
              </p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={points}>
                    <defs>
                      <linearGradient id="sViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_PRIMARY} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={GREEN_PRIMARY} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="sVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={GREEN_SECONDARY} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={GREEN_SECONDARY} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      interval="preserveStartEnd"
                    />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.full_label ?? ""}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Consultations"
                      stroke={GREEN_PRIMARY}
                      strokeWidth={2.5}
                      fill="url(#sViews)"
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Visiteurs"
                      stroke={GREEN_SECONDARY}
                      strokeWidth={2}
                      fill="url(#sVisitors)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Répartition */}
            <div className="surface-card p-5">
              <h3 className="text-sm font-semibold">Répartition par véhicule</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Part des consultations</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topVehicles.slice(0, 5)}
                      dataKey="views"
                      nameKey="label"
                      innerRadius="55%"
                      outerRadius="80%"
                      paddingAngle={2}
                    >
                      {topVehicles.slice(0, 5).map((entry, i) => (
                        <Cell key={entry.vehicle_id} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 space-y-1.5">
                {topVehicles.slice(0, 5).map((p, i) => (
                  <li key={p.vehicle_id} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="min-w-0 flex-1 truncate">{p.label}</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat("fr-FR").format(p.views)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Temps d'affichage moyen par véhicule */}
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold">Engagement par véhicule</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Consultations, temps d'affichage moyen et clics
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVehicles} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={130}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="views"
                    name="Consultations"
                    fill={GREEN_PRIMARY}
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="clicks"
                    name="Clics"
                    fill={GREEN_LIGHT}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  change,
  hint,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  change?: number | null;
  hint?: string;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint ?? " "}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {change !== null && change !== undefined && (
        <p
          className={`mt-2 flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-destructive"
            }`}
        >
          {change >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {change >= 0 ? "+" : ""}
          {change.toFixed(1)}% vs période précédente
        </p>
      )}
    </div>
  );
}