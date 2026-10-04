import { useMemo, useState } from "react";
import {
  Eye,
  MessageCircle,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Package,
  Ship,
  CreditCard,
  StickyNote,
  Hash,
  ExternalLink,
  Inbox,
  Users,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { OrderStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CONTAINER_STAGES,
  fcfa,
  orderTotal,
  useContainers,
  usePreorders,
  useUpdatePreorder,
  useDeletePreorder,
  type Preorder,
  type Container,
} from "@/data/admin-store";

const STATUSES: Preorder["status"][] = [
  // Étapes commerciales
  "Nouvelle demande",
  "Prise en charge",
  "Acompte Versé",
  // Transit & logistique
  "Commande effectuée depuis la Chine",
  "En transit maritime",
  "Arrivé au port",
  "Dédouanement en cours",
  "Dédouané",
  "En livraison",
  "Livré",
  // Statuts finaux
  "Terminée",
  "Annulée",
];
const PER_PAGE = 5;

export function AdminOrders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const { data: preordersData, isLoading } = usePreorders({ page: "1", per_page: "100" });
  const { data: containersData } = useContainers({ page: "1", per_page: "100" });
  const updateMut = useUpdatePreorder();
  const deleteMut = useDeletePreorder();

  const orders: Preorder[] = preordersData?.data ?? [];
  const containers: Container[] = containersData?.data ?? [];

  const stats = useMemo(() => {
    const byStatus = (s: Preorder["status"]) => orders.filter((o) => o.status === s).length;

    const inProgress = orders.filter(
      (o) => o.status !== "Terminée" && o.status !== "Annulée" && o.status !== "Livré",
    ).length;

    return {
      total: orders.length,
      nouveaux: byStatus("Nouvelle demande"),
      enCours: inProgress,
      livre: byStatus("Livré") + byStatus("Terminée"),
    };
  }, [orders]);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          `${o.reference} ${o.client_name} ${o.vehicle?.model ?? ""} ${o.phone}`
            .toLowerCase()
            .includes(q.toLowerCase()) && (status === "all" || o.status === status),
      ),
    [orders, q, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const selected = orders.find((o) => String(o.id) === openId) ?? null;

  const whatsapp = (phone: string, text: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

  const handleStatusChange = async (order: Preorder, newStatus: string) => {
    await updateMut.mutateAsync({ id: order.id, data: { status: newStatus } });
  };

  const handleContainerChange = async (order: Preorder, containerCode: string | null) => {
    await updateMut.mutateAsync({ id: order.id, data: { container_code: containerCode } });
  };

  if (isLoading) {
    return (
      <div>
        <PageHeading title="Précommandes & prospects" subtitle="Chargement..." />
        <div className="surface-card p-8 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeading
        title="Précommandes & prospects"
        subtitle="Gérez les demandes de réservation et le suivi commercial des clients."
      />

      {/* ═══════════════════════════════════════════════════════════
          CARDS STATISTIQUES
      ═══════════════════════════════════════════════════════════ */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Inbox} label="Total dossiers" value={stats.total} />
        <StatCard icon={Users} label="Nouvelles demandes" value={stats.nouveaux} />
        <StatCard icon={Truck} label="En cours" value={stats.enCours} />
        <StatCard icon={CheckCircle2} label="Livrés / Terminés" value={stats.livre} />
      </div>

      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un client, un n° de réservation…"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            VUE MOBILE — CARDS
        ═══════════════════════════════════════════════════════════ */}
        <div className="mt-4 space-y-3 md:hidden">
          {rows.map((o) => (
            <div
              key={o.id}
              onClick={() => setOpenId(String(o.id))}
              className="cursor-pointer overflow-hidden rounded-xl border border-border bg-white p-3.5 transition-all active:scale-[0.99]"
            >
              {/* Ligne 1 : Référence + Statut */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{o.reference}</p>
                  {o.appointment_code && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700">
                      <Hash className="h-2.5 w-2.5" />
                      {o.appointment_code}
                    </span>
                  )}
                </div>
                <OrderStatusBadge status={o.status} />
              </div>

              {/* Ligne 2 : Client */}
              <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                  {o.client_name?.charAt(0).toUpperCase() ?? "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{o.client_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.dial ?? "+229"} {o.phone}
                  </p>
                </div>
              </div>

              {/* Ligne 3 : Véhicule + RDV */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md bg-slate-50 px-2.5 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Véhicule
                  </p>
                  <p className="mt-0.5 truncate font-semibold text-slate-900">
                    {o.vehicle ? `${o.vehicle.brand} ${o.vehicle.model}` : "—"}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 px-2.5 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    RDV
                  </p>
                  <p className="mt-0.5 truncate font-semibold text-slate-900">
                    {o.appointment_date ?? "—"}
                    {o.appointment_time && (
                      <span className="ml-1 text-slate-500">· {o.appointment_time}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-2.5"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setOpenId(String(o.id))}
                  className="h-8 gap-1.5 px-2.5 text-xs font-medium"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Voir
                </Button>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium">Aucune précommande trouvée</p>
              <p className="text-xs text-muted-foreground">Essayez de modifier vos filtres.</p>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            VUE DESKTOP — TABLEAU
        ═══════════════════════════════════════════════════════════ */}
        <div className="mt-4 hidden overflow-x-auto rounded-lg border border-border md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-secondary/30 hover:bg-secondary/30">
                <TableHead>N° Réservation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>RDV</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-semibold">{o.reference}</p>
                    {o.appointment_code && (
                      <p className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-amber-700">
                        <Hash className="h-2.5 w-2.5" />
                        {o.appointment_code}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{o.client_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.dial ?? "+229"} {o.phone}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {o.vehicle ? `${o.vehicle.brand} ${o.vehicle.model}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {o.appointment_date ? (
                      <>
                        <p className="font-medium">{o.appointment_date}</p>
                        {o.appointment_time && (
                          <p className="text-xs text-muted-foreground">{o.appointment_time}</p>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Voir le dossier"
                        onClick={() => setOpenId(String(o.id))}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Aucune précommande ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length} dossier(s) — page {current} / {pages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
            >
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          DRAWER — Détails complets du dossier
      ═══════════════════════════════════════════════════════════ */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-hidden border-l border-border bg-slate-50 p-0 sm:max-w-2xl"
        >
          {selected && (
            <>
              {/* Header */}
              <div className="border-b border-border bg-white px-5 py-5 sm:px-6">
                <SheetHeader className="space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <SheetTitle className="text-lg font-bold">
                      Dossier {selected.reference}
                    </SheetTitle>
                    <OrderStatusBadge status={selected.status} />
                  </div>
                  <SheetDescription className="text-xs text-slate-500">
                    Demande du{" "}
                    {new Date(selected.created_at ?? "").toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="space-y-4">
                  {/* ─── Section 1 : Informations client ─── */}
                  <InfoSection icon={User} title="Informations client">
                    <dl className="space-y-3">
                      <InfoRow
                        icon={User}
                        label="Nom complet"
                        value={selected.full_name ?? selected.client_name}
                      />
                      <InfoRow
                        icon={Phone}
                        label="Téléphone"
                        value={`${selected.dial ?? "+229"} ${selected.phone}`}
                      />
                      <InfoRow icon={Mail} label="Email" value={selected.email ?? "—"} />
                      <InfoRow icon={MapPin} label="Ville" value={selected.city ?? "—"} />
                      <InfoRow icon={MapPin} label="Pays" value={selected.country ?? "—"} />
                    </dl>
                  </InfoSection>

                  {/* ─── Section 2 : Rendez-vous ─── */}
                  <InfoSection icon={Calendar} title="Rendez-vous en agence">
                    {selected.appointment_date ||
                      selected.appointment_time ||
                      selected.appointment_code ? (
                      <dl className="space-y-3">
                        <InfoRow
                          icon={Calendar}
                          label="Date"
                          value={selected.appointment_date ?? "Non définie"}
                        />
                        <InfoRow
                          icon={Clock}
                          label="Heure"
                          value={selected.appointment_time ?? "Non définie"}
                        />
                        <InfoRow
                          icon={Hash}
                          label="Code RDV"
                          value={
                            selected.appointment_code ? (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-amber-700">
                                {selected.appointment_code}
                              </span>
                            ) : (
                              "—"
                            )
                          }
                        />
                      </dl>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Aucun rendez-vous planifié pour ce dossier.
                      </p>
                    )}
                  </InfoSection>

                  {/* ─── Section 3 : Véhicule ─── */}
                  <InfoSection icon={Package} title="Véhicule précommandé">
                    {selected.vehicle ? (
                      <div className="space-y-3">
                        <dl className="space-y-3">
                          <InfoRow icon={Package} label="Marque" value={selected.vehicle.brand} />
                          <InfoRow icon={Package} label="Modèle" value={selected.vehicle.model} />
                          {selected.vehicle.year && (
                            <InfoRow
                              icon={Calendar}
                              label="Année"
                              value={String(selected.vehicle.year)}
                            />
                          )}
                          {selected.vehicle.energy && (
                            <InfoRow
                              icon={Package}
                              label="Énergie"
                              value={selected.vehicle.energy}
                            />
                          )}
                        </dl>

                        {/* 🔗 Lien vers la fiche publique du véhicule */}
                        <a
                          href={`/vehicules/${selected.vehicle.slug ?? selected.vehicle.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" />
                            Voir la fiche du véhicule
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">Aucun véhicule associé.</p>
                    )}
                  </InfoSection>

                  {/* ─── Section 4 : Devis & options ─── */}
                  <InfoSection icon={CreditCard} title="Devis détaillé">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 py-2">
                        <span className="text-slate-600">
                          {selected.vehicle
                            ? `${selected.vehicle.brand} ${selected.vehicle.model}`
                            : "Véhicule"}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {fcfa(selected.base_price ?? 0)}
                        </span>
                      </div>
                      {selected.options?.map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b border-slate-100 py-2 text-slate-500"
                        >
                          <span>+ {opt.label}</span>
                          <span>{fcfa(opt.price ?? 0)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-slate-900">Total devisé</span>
                        <span className="font-display text-lg font-extrabold text-emerald-700">
                          {fcfa(orderTotal(selected))}
                        </span>
                      </div>
                    </div>
                  </InfoSection>

                  {/* ─── Section 5 : Logistique & suivi ─── */}
                  <InfoSection icon={Ship} title="Logistique & suivi">
                    <div className="space-y-3">
                      {/* Statut du dossier — principal */}
                      <div>
                        <Label className="text-xs font-medium text-slate-600">
                          Statut du dossier
                        </Label>
                        <Select
                          value={selected.status}
                          onValueChange={async (v) => {
                            await handleStatusChange(selected, v);
                          }}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${s === "Annulée"
                                      ? "bg-red-500"
                                      : s === "Terminée" || s === "Livré"
                                        ? "bg-emerald-500"
                                        : s.includes("transit") ||
                                          s.includes("port") ||
                                          s.includes("Dédouan") ||
                                          s.includes("production")
                                          ? "bg-sky-500"
                                          : s === "Acompte Versé" || s === "Prise en charge"
                                            ? "bg-amber-500"
                                            : "bg-slate-400"
                                      }`}
                                  />
                                  {s}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Conteneur associé */}
                      <div>
                        <Label className="text-xs font-medium text-slate-600">
                          Conteneur associé
                        </Label>
                        <Select
                          value={selected.container_code ?? "none"}
                          onValueChange={async (v) => {
                            await handleContainerChange(selected, v === "none" ? null : v);
                          }}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Aucun" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun conteneur</SelectItem>
                            {containers.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code} — {c.vessel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Timeline de progression */}
                      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Progression du dossier
                        </p>
                        <div className="space-y-2">
                          {[
                            "Nouvelle demande",
                            "Prise en charge",
                            "Acompte Versé",
                            "En production",
                            "En transit maritime",
                            "Arrivé au port",
                            "Dédouanement en cours",
                            "Dédouané",
                            "En livraison",
                            "Livré",
                          ].map((step, i, arr) => {
                            const currentIndex = arr.indexOf(selected.status);
                            const isDone = currentIndex >= i;
                            const isCurrent = selected.status === step;
                            return (
                              <div key={step} className="flex items-center gap-2.5 text-xs">
                                <span
                                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${isDone
                                    ? "border-emerald-600 bg-emerald-600"
                                    : "border-slate-300 bg-white"
                                    }`}
                                >
                                  {isDone && (
                                    <svg
                                      viewBox="0 0 12 12"
                                      className="h-2.5 w-2.5 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 6l2 2 4-4" />
                                    </svg>
                                  )}
                                </span>
                                <span
                                  className={`${isCurrent
                                    ? "font-semibold text-emerald-700"
                                    : isDone
                                      ? "text-slate-700"
                                      : "text-slate-400"
                                    }`}
                                >
                                  {step}
                                </span>
                                {isCurrent && (
                                  <span className="ml-auto rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                    Actuel
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </InfoSection>

                  {/* ─── Section 6 : Notes ─── */}
                  {selected.notes && (
                    <InfoSection icon={StickyNote} title="Notes du client">
                      <p className="whitespace-pre-line rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
                        {selected.notes}
                      </p>
                    </InfoSection>
                  )}

                  {/* ─── Section 7 : Métadonnées ─── */}
                  <InfoSection icon={FileText} title="Informations système">
                    <dl className="space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">ID interne</span>
                        <span className="font-mono text-slate-700">#{selected.id}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Référence</span>
                        <span className="font-mono text-slate-700">{selected.reference}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
                        <span className="text-slate-500">Créé le</span>
                        <span className="text-slate-700">
                          {new Date(selected.created_at ?? "").toLocaleString("fr-FR")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-slate-500">Mis à jour</span>
                        <span className="text-slate-700">
                          {selected.updated_at
                            ? new Date(selected.updated_at).toLocaleString("fr-FR")
                            : "—"}
                        </span>
                      </div>
                    </dl>
                  </InfoSection>
                </div>
              </div>

              {/* Footer sticky */}
              <div className="border-t border-border bg-white px-5 py-3.5 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    asChild
                    className="h-11 flex-1 gap-2 rounded-lg bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <a
                      href={whatsapp(
                        `${selected.dial ?? "+229"}${selected.phone}`,
                        `Bonjour ${selected.client_name}, votre dossier ${selected.reference} pour ${selected.vehicle
                          ? `${selected.vehicle.brand} ${selected.vehicle.model}`
                          : ""
                        } (total ${fcfa(orderTotal(selected))}) est suivi par AutoTrack Bénin.`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Envoyer une relance WhatsApp
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setOpenId(null)}
                    className="h-11 flex-1 rounded-lg border-slate-300 text-sm font-semibold sm:flex-none"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ═══════════ SOUS-COMPOSANTS ═══════════ */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border">
        <Icon className="h-4 w-4 text-slate-600" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 truncate font-display text-xl font-extrabold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-slate-700">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
        {label}
      </dt>
      <dd className="text-right text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}