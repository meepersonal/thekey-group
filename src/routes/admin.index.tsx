import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, ClipboardList, Ship, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeading } from "@/components/admin/admin-shell";
import { OrderStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { ORDERS_BY_MONTH, fcfa, orderTotal, useAdmin } from "@/data/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Back-Office AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Vue d'ensemble des véhicules, précommandes et conteneurs maritimes d'AutoTrack Bénin.",
      },
      { property: "og:title", content: "Tableau de bord — Back-Office AutoTrack Bénin" },
      {
        property: "og:description",
        content: "KPI, graphiques et dernières précommandes de la plateforme AutoTrack Bénin.",
      },
    ],
  }),
  component: AdminDashboard,
});

const PIE_COLORS = ["var(--accent)", "var(--navy)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Car;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-navy text-navy-foreground">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { vehicles, orders, containers } = useAdmin();

  const inTransit = containers.filter((c) => c.stage <= 2).length;
  const activeOrders = orders.filter((o) => o.status !== "Annulée");
  const revenue = activeOrders.reduce((s, o) => s + orderTotal(o), 0);

  const byEnergy = ["Électrique", "Hybride", "Essence", "Diesel"]
    .map((label) => ({
      name: label,
      value: vehicles.filter((v) => v.energy.toLowerCase().includes(label.toLowerCase())).length,
    }))
    .filter((d) => d.value > 0);

  const byBrand = Array.from(new Set(vehicles.map((v) => v.brand))).map((b) => ({
    name: b,
    value: vehicles.filter((v) => v.brand === b).length,
  }));

  return (
    <div>
      <PageHeading
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité — catalogue, précommandes et logistique maritime."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Car}
          label="Véhicules au catalogue"
          value={`${vehicles.length} modèles`}
          hint={`${vehicles.filter((v) => v.status === "En Stock").length} en stock`}
        />
        <KpiCard
          icon={ClipboardList}
          label="Précommandes en cours"
          value={`${activeOrders.length} demandes`}
          hint={`${orders.filter((o) => o.status === "Nouvelle demande").length} nouvelles`}
        />
        <KpiCard
          icon={Ship}
          label="Conteneurs en transit"
          value={`${inTransit} navires`}
          hint={`${containers.length} dossiers logistiques suivis`}
        />
        <KpiCard
          icon={Wallet}
          label="CA estimé des réservations"
          value={fcfa(revenue)}
          hint="Options incluses, hors dossiers annulés"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="surface-card p-5 xl:col-span-2">
          <h2 className="font-display text-base font-bold">
            Évolution des précommandes (6 derniers mois)
          </h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ORDERS_BY_MONTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="precommandes"
                  stroke="var(--accent)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <h2 className="font-display text-base font-bold">Parc par motorisation</h2>
          <div className="mt-2 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byEnergy} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  {byEnergy.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="surface-card p-5">
          <h2 className="font-display text-base font-bold">Répartition par marque</h2>
          <div className="mt-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byBrand}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={26} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--navy)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold">Dernières précommandes</h2>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/precommandes">Tout voir</Link>
            </Button>
          </div>
          <div className="mt-4 space-y-2">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {o.clientName} · {o.vehicle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {o.id} · {o.date} · {fcfa(orderTotal(o))}
                  </p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
