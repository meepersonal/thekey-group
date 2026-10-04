import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Ship,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Anchor,
  FileText,
  Unlink,
  Package,
  User,
  Hash,
  CalendarClock,
  Layers,
  Link2,
  History,
  PlusCircle,
  Container as ContainerIcon,
  PackageCheck,
  PackageX,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { OrderStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CONTAINER_STAGES,
  useAddContainerEvent,
  useContainer,
  useContainers,
  useCreateContainer,
  useDeleteContainer,
  useDeleteContainerEvent,
  useUpdateContainer,
  usePreorders,
  useUpdatePreorder,
  type Container,
  type Preorder,
} from "@/data/admin-store";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

const PER_PAGE = 10;

/** Seules les commandes dont l'acompte est versé peuvent être rattachées à un conteneur. */
const ATTACHABLE_STATUS = "Acompte Versé";

/** Badges d'étape : neutres, sauf l'étape active. */
const STAGE_BADGE: Record<number, string> = {
  0: "bg-slate-100 text-slate-700",
  1: "bg-slate-100 text-slate-700",
  2: "bg-slate-100 text-slate-700",
  3: "bg-slate-100 text-slate-700",
  4: "bg-slate-200 text-slate-800",
  5: "bg-slate-200 text-slate-800",
  6: "bg-slate-900 text-white",
};

const emptyContainerForm = () => ({
  code: "",
  vessel: "",
  carrier: "",
  port_depart: "",
  port_arrivee: "Cotonou, Bénin",
  departure_date: "",
  eta: "",
  stage: "0",
  note: "",
  event_date: "",
  event_location: "",
  event_comments: "",
  preorder_ids: [] as number[],
});

const today = () => new Date().toISOString().slice(0, 10);

const formatDate = (value: string | null) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("fr-FR") : "—";

export function AdminContainers() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [form, setForm] = useState(emptyContainerForm());

  const [pendingDelete, setPendingDelete] = useState<Container | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const params = useMemo(() => {
    const p: Record<string, string> = { per_page: String(PER_PAGE), page: String(page) };
    if (search) p["search"] = search;
    if (stage !== "all") p["stage"] = stage;
    return p;
  }, [search, stage, page]);

  const { data, isLoading } = useContainers(params);
  const createMut = useCreateContainer();
  const updateMut = useUpdateContainer();
  const deleteMut = useDeleteContainer();
  const deleteEventMut = useDeleteContainerEvent();

  const containers: Container[] = data?.data ?? [];
  const meta = data?.meta;
  const stageCounts = data?.stage_counts ?? {};
  const totalPages = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;
  const total = meta?.total ?? 0;

  const stats = useMemo(() => {
    const counts = stageCounts as Record<string, number>;
    const computedTotal =
      Object.keys(counts).length > 0
        ? Object.values(counts).reduce((s, n) => s + n, 0)
        : total;

    const enAttente = (counts["0"] ?? 0) + (counts["1"] ?? 0) + (counts["2"] ?? 0);
    const enStock = (counts["3"] ?? 0) + (counts["4"] ?? 0) + (counts["5"] ?? 0);
    const livres = counts["6"] ?? 0;

    return { total: computedTotal, enAttente, enStock, livres };
  }, [stageCounts, total]);

  const { data: createEligibleData, isLoading: isLoadingCreateEligible } = usePreorders({
    page: "1",
    per_page: "100",
    status: ATTACHABLE_STATUS,
  });
  const createEligiblePreorders: Preorder[] = (createEligibleData?.data ?? []).filter(
    (p) => !p.container_code,
  );

  const openCreate = () => {
    setForm({ ...emptyContainerForm(), event_date: today() });
    setIsCreateOpen(true);
  };

  const toggleFormPreorder = (id: number) => {
    setForm((prev) => ({
      ...prev,
      preorder_ids: prev.preorder_ids.includes(id)
        ? prev.preorder_ids.filter((pid) => pid !== id)
        : [...prev.preorder_ids, id],
    }));
  };

  const handleCreate = async () => {
    if (!form.code.trim()) {
      toast.error("Le code conteneur est requis.");
      return;
    }
    try {
      await createMut.mutateAsync({
        code: form.code.trim().toUpperCase(),
        vessel: form.vessel || null,
        carrier: form.carrier || null,
        port_depart: form.port_depart || null,
        port_arrivee: form.port_arrivee || null,
        departure_date: form.departure_date || null,
        eta: form.eta || null,
        stage: Number(form.stage),
        note: form.note || null,
        initial_event: {
          event_date: form.event_date || null,
          location: form.event_location || null,
          comments: form.event_comments || null,
        },
        preorder_ids: form.preorder_ids,
      });
      setIsCreateOpen(false);
      setForm(emptyContainerForm());
    } catch {
      /* message affiché par la mutation */
    }
  };

  const handleDelete = () => {
    if (!pendingDelete) return;
    const codeToDelete = pendingDelete.code;
    deleteMut.mutate(codeToDelete, {
      onSuccess: () => {
        if (openCode === codeToDelete) setOpenCode(null);
        setPendingDelete(null);
      },
      onError: () => setPendingDelete(null),
    });
  };

  return (
    <div>
      <PageHeading
        title="Suivi des conteneurs"
        subtitle="Suivez chaque étape logistique : date, lieu et commentaires de l'expédition."
      />

      {/* ═══════════ CARDS STATISTIQUES ═══════════ */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ContainerIcon}
          label="Total conteneurs"
          value={stats.total}
          description="Toutes étapes confondues"
        />
        <StatCard
          icon={Inbox}
          label="En attente"
          value={stats.enAttente}
          description="Départ → Transit"
        />
        <StatCard
          icon={PackageCheck}
          label="En stock / Arrivés"
          value={stats.enStock}
          description="Port → Dédouané"
        />
        <StatCard
          icon={PackageX}
          label="Livrés"
          value={stats.livres}
          description="Conteneurs clôturés"
        />
      </div>

      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher un conteneur, un navire, un client…"
              aria-label="Rechercher un conteneur"
              className="pl-9"
            />
          </div>

          <Select
            value={stage}
            onValueChange={(v) => {
              setStage(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[220px]" aria-label="Filtrer par étape">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les étapes</SelectItem>
              {CONTAINER_STAGES.map((label, i) => (
                <SelectItem key={label} value={String(i)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="accent" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Ajouter un conteneur
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conteneur</TableHead>
                <TableHead>Navire / Départ</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Étape actuelle</TableHead>
                <TableHead>Dernière étape</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((c) => (
                <TableRow key={c.code}>
                  <TableCell className="font-semibold">{c.code}</TableCell>
                  <TableCell className="text-sm">
                    <p className="font-medium">{c.vessel || "—"}</p>
                    <p className="text-xs text-muted-foreground">{c.port_depart || "—"}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>{c.client || "—"}</p>
                    <p className="text-xs text-muted-foreground">{c.preorders_count} commande(s)</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold",
                        STAGE_BADGE[c.stage] ?? "bg-slate-100 text-slate-700",
                      )}
                    >
                      {c.stage_label}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.latest_event ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {c.latest_event.stage_label}
                        </span>
                        <br />
                        {formatDate(c.latest_event.event_date)}
                        {c.latest_event.location ? ` · ${c.latest_event.location}` : ""}
                      </>
                    ) : (
                      `Aucune (${c.events_count})`
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(c.eta)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => setOpenCode(c.code)}>
                        <Ship className="h-4 w-4" />
                        Gérer
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={`Supprimer ${c.code}`}
                        title={
                          c.preorders_count > 0
                            ? `${c.preorders_count} commande(s) rattachée(s) : suppression impossible`
                            : "Supprimer le conteneur"
                        }
                        disabled={c.preorders_count > 0}
                        onClick={() => setPendingDelete(c)}
                      >
                        <Trash2
                          className={cn(
                            "h-4 w-4",
                            c.preorders_count > 0 ? "text-muted-foreground" : "text-destructive",
                          )}
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {containers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    {isLoading ? "Chargement…" : "Aucun conteneur ne correspond à votre recherche."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <p className="text-xs text-muted-foreground">
            {total} conteneur(s) · page {currentPage} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════ DRAWER : création ═══════════ */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="w-full overflow-y-auto p-6 sm:max-w-lg">
          <SheetHeader className="space-y-2 border-b border-border/60 pb-4 text-left">
            <SheetTitle>Ajouter un conteneur</SheetTitle>
            <SheetDescription>
              Créez un nouveau conteneur pour suivre l'arrivée d'un véhicule importé.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="space-y-1.5">
              <Label htmlFor="code">Code conteneur *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="CONT-2026-NEW01"
                className="uppercase"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="vessel">Navire</Label>
                <Input
                  id="vessel"
                  value={form.vessel}
                  onChange={(e) => setForm({ ...form, vessel: e.target.value })}
                  placeholder="MSC ALTAIR"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="carrier">Transporteur / Armateur</Label>
                <Input
                  id="carrier"
                  value={form.carrier}
                  onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                  placeholder="MSC"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="port_depart">Port de départ</Label>
                <Input
                  id="port_depart"
                  value={form.port_depart}
                  onChange={(e) => setForm({ ...form, port_depart: e.target.value })}
                  placeholder="Ningbo, Chine"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="port_arrivee">Port d'arrivée</Label>
                <Input
                  id="port_arrivee"
                  value={form.port_arrivee}
                  onChange={(e) => setForm({ ...form, port_arrivee: e.target.value })}
                  placeholder="Cotonou, Bénin"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="departure_date">Date de départ</Label>
                <Input
                  id="departure_date"
                  type="date"
                  value={form.departure_date}
                  onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="eta">ETA (arrivée estimée)</Label>
                <Input
                  id="eta"
                  type="date"
                  value={form.eta}
                  onChange={(e) => setForm({ ...form, eta: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="note">Note interne</Label>
              <Textarea
                id="note"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Dossier, N° de lot, particularité…"
              />
            </div>
          </div>

          {/* ── Première entrée de l'historique ── */}
          <section className="space-y-4 rounded-xl border border-border bg-slate-50 p-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Première étape du suivi
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Elle est enregistrée automatiquement dans l'historique du conteneur — inutile de la
                ressaisir ensuite.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="stage">Étape</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                  <SelectTrigger id="stage" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTAINER_STAGES.map((label, i) => (
                      <SelectItem key={label} value={String(i)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="event_date">Date de l'étape</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event_location">Lieu</Label>
              <Input
                id="event_location"
                value={form.event_location}
                onChange={(e) => setForm({ ...form, event_location: e.target.value })}
                placeholder="Port de Ningbo, Cotonou, entrepôt…"
                className="bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="event_comments">Commentaires</Label>
              <Textarea
                id="event_comments"
                rows={3}
                value={form.event_comments}
                onChange={(e) => setForm({ ...form, event_comments: e.target.value })}
                placeholder="Quai 3, conteneur scellé, dossier douane transmis…"
                className="bg-white"
              />
            </div>
          </section>

          {/* ── Commandes à rattacher ── */}
          <section className="space-y-3 rounded-xl border border-border bg-slate-50 p-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Commandes à rattacher
                </h3>
                <span className="text-xs text-muted-foreground">
                  {form.preorder_ids.length} sélectionnée(s) · {createEligiblePreorders.length}{" "}
                  éligible(s)
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Seules les commandes dont l'acompte est versé et qui ne sont rattachées à aucun
                conteneur sont proposées. Elles seront liées à ce conteneur dès sa création.
              </p>
            </div>

            {isLoadingCreateEligible ? (
              <p className="rounded-lg border border-dashed border-border bg-white p-4 text-center text-sm text-muted-foreground">
                Chargement des commandes éligibles…
              </p>
            ) : createEligiblePreorders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-white p-4 text-center text-sm text-muted-foreground">
                Aucune commande « Acompte Versé » en attente de rattachement.
              </p>
            ) : (
              <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                {createEligiblePreorders.map((p) => {
                  const checked = form.preorder_ids.includes(p.id);
                  return (
                    <li key={p.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-white px-3 py-2.5 transition-colors hover:border-slate-400",
                          checked && "border-slate-900 bg-slate-50",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleFormPreorder(p.id)}
                          aria-label={`Rattacher ${p.reference}`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {p.reference}
                            {p.appointment_code && (
                              <span className="ml-2 font-mono text-[10px] tracking-widest text-slate-500">
                                {p.appointment_code}
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {p.client_name}
                            {p.vehicle ? ` · ${p.vehicle.brand} ${p.vehicle.model}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0">
                          <OrderStatusBadge status={p.status} />
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            {form.preorder_ids.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {form.preorder_ids.length} commande(s) seront rattachées à{" "}
                <span className="font-mono font-semibold text-foreground">
                  {form.code.trim().toUpperCase() || "…"}
                </span>
              </p>
            )}
          </section>

          <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Annuler
            </Button>
            <Button variant="accent" onClick={handleCreate} disabled={createMut.isPending}>
              {createMut.isPending ? "Création…" : "Créer le conteneur"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ═══════════ DRAWER : gestion du conteneur ═══════════ */}
      <ContainerDrawer
        code={openCode}
        onOpenChange={(next) => !next && setOpenCode(null)}
        updateMut={updateMut}
        deleteEventMut={deleteEventMut}
      />

      {/* ═══════════ CONFIRMATION : suppression conteneur ═══════════ */}
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open && !deleteMut.isPending) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDelete && pendingDelete.preorders_count > 0
                ? "Suppression impossible"
                : `Supprimer le conteneur ${pendingDelete?.code} ?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && pendingDelete.preorders_count > 0 ? (
                <span>
                  Le conteneur{" "}
                  <span className="font-semibold text-foreground">{pendingDelete.code}</span> est
                  rattaché à{" "}
                  <span className="font-semibold text-foreground">
                    {pendingDelete.preorders_count} commande(s)
                  </span>
                  . Détachez d'abord ces commandes (dans Précommandes) pour pouvoir le supprimer.
                </span>
              ) : (
                <span>
                  Le conteneur{" "}
                  <span className="font-semibold text-foreground">{pendingDelete?.code}</span> sera
                  définitivement supprimé, ainsi que tout son historique de suivi. Cette action est
                  irréversible.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMut.isPending}>Annuler</AlertDialogCancel>
            {pendingDelete && pendingDelete.preorders_count > 0 ? (
              <AlertDialogAction
                className="bg-muted text-muted-foreground hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setPendingDelete(null);
                }}
              >
                J'ai compris
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
                disabled={deleteMut.isPending}
              >
                {deleteMut.isPending ? "Suppression…" : "Supprimer"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ContainerDrawer({
  code,
  onOpenChange,
  deleteEventMut,
}: {
  code: string | null;
  onOpenChange: (open: boolean) => void;
  updateMut: ReturnType<typeof useUpdateContainer>;
  deleteEventMut: ReturnType<typeof useDeleteContainerEvent>;
}) {
  const { data: container, isLoading } = useContainer(code);
  const addEventMut = useAddContainerEvent();
  const updatePreorderMut = useUpdatePreorder();

  const { data: attachedData, isLoading: isLoadingAttached } = usePreorders({
    page: "1",
    per_page: "100",
    ...(container?.code ? { container_code: container.code } : {}),
  });
  const attachedPreorders: Preorder[] = attachedData?.data ?? [];
  const attachedTotal = attachedData?.meta?.total ?? 0;

  const { data: eligibleData } = usePreorders({
    page: "1",
    per_page: "100",
    status: ATTACHABLE_STATUS,
  });
  const eligiblePreorders: Preorder[] = eligibleData?.data ?? [];

  const [eventStage, setEventStage] = useState("0");
  const [eventDate, setEventDate] = useState(today());
  const [eventLocation, setEventLocation] = useState("");
  const [eventComments, setEventComments] = useState("");
  const [syncStage, setSyncStage] = useState(true);

  const [pendingEventDelete, setPendingEventDelete] = useState<number | null>(null);
  const [attachValue, setAttachValue] = useState("");

  const availablePreorders = useMemo(
    () => eligiblePreorders.filter((p) => !p.container_code),
    [eligiblePreorders],
  );

  useEffect(() => {
    if (!container) return;
    setEventStage(String(container.stage));
    setEventDate(today());
  }, [container]);

  const history = useMemo(() => {
    return [...(container?.events ?? [])].sort((a, b) => {
      const byDate = (a.event_date ?? a.created_at ?? "").localeCompare(
        b.event_date ?? b.created_at ?? "",
      );
      return byDate !== 0 ? byDate : a.id - b.id;
    });
  }, [container]);

  const addEvent = async () => {
    if (!container) return;
    if (!eventDate) {
      toast.error("Renseignez la date de l'étape.");
      return;
    }
    try {
      await addEventMut.mutateAsync({
        code: container.code,
        data: {
          stage: Number(eventStage),
          event_date: eventDate,
          location: eventLocation || null,
          comments: eventComments || null,
          update_stage: syncStage,
        },
      });
      setEventLocation("");
      setEventComments("");
    } catch {
      /* message affiché par la mutation */
    }
  };

  const handleDeleteEvent = () => {
    if (!container || pendingEventDelete === null) return;
    deleteEventMut.mutate(
      { code: container.code, eventId: pendingEventDelete },
      { onSettled: () => setPendingEventDelete(null) },
    );
  };

  const attachPreorder = async (preorderId: number) => {
    if (!container) return;
    try {
      await updatePreorderMut.mutateAsync({
        id: preorderId,
        data: { container_code: container.code },
      });
      toast.success("Commande rattachée au conteneur.");
    } catch {
      toast.error("Impossible de rattacher cette commande.");
    }
  };

  const detachPreorder = async (preorderId: number) => {
    try {
      await updatePreorderMut.mutateAsync({
        id: preorderId,
        data: { container_code: null },
      });
      toast.success("Commande détachée du conteneur.");
    } catch {
      toast.error("Impossible de détacher cette commande.");
    }
  };

  return (
    <>
      <Sheet open={Boolean(code)} onOpenChange={onOpenChange}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl">
          {/* ─── Header sobre ─── */}
          <div className="border-b border-border px-6 py-5">
            <SheetHeader className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
                  <Anchor className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="font-display text-lg font-extrabold tracking-tight">
                    {container?.code ?? "Conteneur"}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs text-muted-foreground">
                    {container
                      ? `${container.vessel || "Navire non renseigné"} · ${container.port_depart || "—"} → ${container.port_arrivee || "—"}`
                      : "Chargement du conteneur…"}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
          </div>

          {isLoading || !container ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Chargement…</p>
          ) : (
            <div className="space-y-6 p-6">
              {/* ── Infos ── */}
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoTile icon={User} label="Client" value={container.client || "—"} />
                <InfoTile icon={Package} label="Commandes liées" value={attachedTotal} />
                <InfoTile icon={Layers} label="Étapes suivies" value={container.events_count} />
              </div>

              {/* ═══════════════════════════════════════════════════
                  SECTION : Commandes rattachées
              ═══════════════════════════════════════════════════ */}
              <SectionCard
                icon={Package}
                title="Commandes rattachées"
                hint={`Conteneur ${container.code}`}
                action={
                  <span className="text-xs font-semibold text-muted-foreground">
                    {attachedPreorders.length}
                  </span>
                }
              >
                {isLoadingAttached ? (
                  <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                    Chargement…
                  </p>
                ) : attachedPreorders.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Aucune commande rattachée à ce conteneur.
                  </p>
                ) : (
                  <ul className="divide-y divide-border/60">
                    {attachedPreorders.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 py-2.5 transition-colors"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                          {p.client_name?.charAt(0).toUpperCase() ?? "?"}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <p className="truncate text-sm font-semibold">{p.reference}</p>
                            {p.appointment_code && (
                              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-widest text-slate-600">
                                <Hash className="h-2.5 w-2.5" />
                                {p.appointment_code}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {p.client_name}
                            {p.vehicle ? ` · ${p.vehicle.brand} ${p.vehicle.model}` : ""}
                          </p>
                        </div>

                        <span className="hidden shrink-0 sm:block">
                          <OrderStatusBadge status={p.status} />
                        </span>

                        <button
                          type="button"
                          onClick={() => detachPreorder(p.id)}
                          aria-label={`Détacher ${p.reference}`}
                          title="Détacher du conteneur"
                          disabled={updatePreorderMut.isPending}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <Unlink className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Ajouter une commande */}
                <div className="mt-4 rounded-xl border border-dashed border-border p-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-slate-500" />
                    <Label htmlFor="attach-preorder" className="text-xs font-semibold">
                      Rattacher une commande « {ATTACHABLE_STATUS} »
                    </Label>
                  </div>

                  {availablePreorders.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Aucune commande éligible disponible — seules les commandes au statut «{" "}
                      {ATTACHABLE_STATUS} » sans conteneur peuvent être rattachées.
                    </p>
                  ) : (
                    <>
                      <Select
                        value={attachValue}
                        onValueChange={(value) => {
                          setAttachValue("");
                          void attachPreorder(Number(value));
                        }}
                        disabled={updatePreorderMut.isPending}
                      >
                        <SelectTrigger id="attach-preorder" className="mt-2 w-full">
                          <SelectValue placeholder="Sélectionner une commande…" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePreorders.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.reference} — {p.client_name}
                              {p.vehicle ? ` · ${p.vehicle.brand} ${p.vehicle.model}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {availablePreorders.length} commande(s) éligible(s) au transport
                      </p>
                    </>
                  )}
                </div>
              </SectionCard>

              {/* ═══════════════════════════════════════════════════
                  SECTION : Historique
              ═══════════════════════════════════════════════════ */}
              <SectionCard
                icon={History}
                title="Historique du suivi"
                hint={`${history.length} entrée(s)`}
              >
                {history.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Aucun événement enregistré. Ajoutez la première étape ci-dessous.
                  </p>
                ) : (
                  <ol className="space-y-0">
                    {history.map((event, index) => {
                      const isCurrentStep = event.stage === container.stage;

                      return (
                        <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
                          {index < history.length - 1 && (
                            <span
                              className="absolute left-[5px] top-3 h-full w-px bg-slate-200"
                              aria-hidden
                            />
                          )}

                          <span
                            className={cn(
                              "relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                              isCurrentStep ? "bg-slate-900" : "bg-slate-300",
                            )}
                            aria-hidden
                          />

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                              <span className="text-sm font-semibold">
                                {formatDate(event.event_date)}
                              </span>

                              <span className="text-xs text-slate-500">
                                {event.stage_label}
                              </span>

                              {isCurrentStep && (
                                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                  En cours
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => setPendingEventDelete(event.id)}
                                aria-label="Supprimer cet événement"
                                className="ml-auto text-slate-400 transition-colors hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {(event.location || event.comments || event.author_name) && (
                              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                {event.location && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {event.location}
                                  </span>
                                )}
                                {event.author_name && <span>par {event.author_name}</span>}
                              </p>
                            )}

                            {event.comments && (
                              <p className="text-sm text-slate-600">{event.comments}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </SectionCard>

              {/* ═══════════════════════════════════════════════════
                  SECTION : Ajouter une étape
              ═══════════════════════════════════════════════════ */}
              <SectionCard
                icon={PlusCircle}
                title="Ajouter une étape"
                hint="Enregistrez un nouveau mouvement"
              >
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="event-stage">Étape</Label>
                      <Select value={eventStage} onValueChange={setEventStage}>
                        <SelectTrigger id="event-stage">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTAINER_STAGES.map((label, i) => (
                            <SelectItem key={label} value={String(i)}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="event-date">Date *</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="event-location">Lieu</Label>
                    <Input
                      id="event-location"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Port de Ningbo, Cotonou, entrepôt…"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="event-comments">Commentaires</Label>
                    <Textarea
                      id="event-comments"
                      rows={3}
                      value={eventComments}
                      onChange={(e) => setEventComments(e.target.value)}
                      placeholder="Quai 3, dossier douane transmis…"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-slate-50/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">Définir comme étape actuelle</p>
                        <p className="text-xs text-muted-foreground">
                          Le conteneur passera à cette étape immédiatement
                        </p>
                      </div>
                    </div>
                    <Switch checked={syncStage} onCheckedChange={setSyncStage} />
                  </div>

                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={addEvent}
                    disabled={addEventMut.isPending}
                  >
                    <FileText className="h-4 w-4" />
                    {addEventMut.isPending ? "Ajout…" : "Ajouter au suivi"}
                  </Button>
                </div>
              </SectionCard>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ═══════════ CONFIRMATION : suppression étape ═══════════ */}
      <AlertDialog
        open={pendingEventDelete !== null}
        onOpenChange={(open) => !open && setPendingEventDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette étape du suivi ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette entrée sera retirée de l'historique du conteneur{" "}
              <span className="font-semibold text-foreground">{container?.code}</span>. Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEventMut.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteEvent}
              disabled={deleteEventMut.isPending}
            >
              {deleteEventMut.isPending ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ═══════════ SOUS-COMPOSANTS ═══════════ */

function SectionCard({
  icon: Icon,
  title,
  hint,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-900 text-white">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-tight">{title}</h3>
            {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate font-display text-xl font-extrabold">{value}</p>
        {description && (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}