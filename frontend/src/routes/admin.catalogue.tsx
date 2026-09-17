import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { VehicleStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  ADMIN_CATEGORIES,
  BRANDS,
  fcfa,
  useAdmin,
  type AdminOption,
  type AdminVehicle,
  type AdminVehicleStatus,
} from "@/data/admin-store";
import suvWhite from "@/assets/car-suv-white.jpg";

export const Route = createFileRoute("/admin/catalogue")({
  validateSearch: (s: Record<string, unknown>) => ({ new: s["new"] === true || s["new"] === "true" }),
  head: () => ({
    meta: [
      { title: "Gestion du catalogue — Back-Office AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Ajoutez, modifiez et archivez les véhicules chinois importés proposés au catalogue AutoTrack Bénin.",
      },
      { property: "og:title", content: "Gestion du catalogue — Back-Office AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Inventaire véhicules : prix, motorisation, statut et options personnalisables.",
      },
    ],
  }),
  component: AdminCatalogue,
});

const STATUSES: AdminVehicleStatus[] = ["En Stock", "Sur Commande", "Masqué"];
const PER_PAGE = 5;

const emptyVehicle = (): AdminVehicle => ({
  id: `v-${Date.now()}`,
  brand: "BYD",
  model: "",
  year: 2026,
  category: "SUV",
  energy: "Essence",
  transmission: "Automatique",
  mileageKm: 0,
  battery: "",
  priceFcfa: 0,
  status: "En Stock",
  featured: false,
  image: suvWhite,
  options: [],
});

function AdminCatalogue() {
  const { vehicles, saveVehicle, deleteVehicle } = useAdmin();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminVehicle | null>(null);
  const [viewing, setViewing] = useState<AdminVehicle | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (search.new) {
      setEditing(emptyVehicle());
      navigate({ search: { new: false }, replace: true });
    }
  }, [search.new, navigate]);

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          `${v.brand} ${v.model}`.toLowerCase().includes(q.toLowerCase()) &&
          (cat === "all" || v.category === cat) &&
          (status === "all" || v.status === status),
      ),
    [vehicles, q, cat, status],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const onSave = () => {
    if (!editing) return;
    if (!editing.model.trim() || editing.priceFcfa <= 0) {
      toast.error("Renseignez au moins le modèle et un prix valide.");
      return;
    }
    saveVehicle(editing);
    toast.success(`${editing.brand} ${editing.model} enregistré.`);
    setEditing(null);
  };

  return (
    <div>
      <PageHeading
        title="Gestion du catalogue"
        subtitle="Inventaire des véhicules importés de Chine proposés à la vente."
      />

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
              placeholder="Rechercher une marque ou un modèle…"
              className="pl-9"
            />
          </div>
          <Select
            value={cat}
            onValueChange={(v) => {
              setCat(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              {ADMIN_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="accent" onClick={() => setEditing(emptyVehicle())}>
            <Plus className="h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Modèle & Marque</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Énergie</TableHead>
                <TableHead>Prix de base</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <img
                      src={v.image}
                      alt={`${v.brand} ${v.model}`}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">
                      {v.brand} {v.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {v.year} · {v.featured ? "En vedette" : "Standard"}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">{v.category}</TableCell>
                  <TableCell className="text-sm">{v.energy}</TableCell>
                  <TableCell className="text-sm font-semibold">{fcfa(v.priceFcfa)}</TableCell>
                  <TableCell>
                    <VehicleStatusBadge status={v.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewing(v)} aria-label="Voir">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditing(v)} aria-label="Éditer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Supprimer"
                        onClick={() => {
                          deleteVehicle(v.id);
                          toast.success(`${v.brand} ${v.model} supprimé du catalogue.`);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Aucun véhicule ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length} véhicule(s) — page {current} / {pages}
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

      {/* View modal */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {viewing.brand} {viewing.model}
                </DialogTitle>
                <DialogDescription>Fiche véhicule — {viewing.year}</DialogDescription>
              </DialogHeader>
              <img
                src={viewing.image}
                alt={viewing.model}
                className="h-44 w-full rounded-xl object-cover"
              />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Catégorie</dt>
                  <dd className="font-semibold">{viewing.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Motorisation</dt>
                  <dd className="font-semibold">{viewing.energy}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Transmission</dt>
                  <dd className="font-semibold">{viewing.transmission}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Kilométrage</dt>
                  <dd className="font-semibold">{viewing.mileageKm} km</dd>
                </div>
                {viewing.battery && (
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Batterie / autonomie</dt>
                    <dd className="font-semibold">{viewing.battery}</dd>
                  </div>
                )}
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Prix de base</dt>
                  <dd className="font-display text-lg font-extrabold">{fcfa(viewing.priceFcfa)}</dd>
                </div>
              </dl>
              {viewing.options.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {viewing.options.map((o) => (
                    <li key={o.id} className="flex justify-between rounded-lg bg-secondary px-3 py-2">
                      <span>{o.label}</span>
                      <span className="font-semibold">+ {fcfa(o.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / create modal */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {vehicles.some((v) => v.id === editing.id)
                    ? "Modifier un véhicule"
                    : "Ajouter un véhicule"}
                </DialogTitle>
                <DialogDescription>
                  Informations générales, spécifications techniques et options payantes.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Marque</Label>
                  <Select
                    value={editing.brand}
                    onValueChange={(v) => setEditing({ ...editing, brand: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Modèle</Label>
                  <Input
                    id="model"
                    className="mt-1.5"
                    value={editing.model}
                    onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                    placeholder="Song Plus EV"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    className="mt-1.5"
                    value={editing.year}
                    onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Prix (FCFA)</Label>
                  <Input
                    id="price"
                    type="number"
                    className="mt-1.5"
                    value={editing.priceFcfa}
                    onChange={(e) => setEditing({ ...editing, priceFcfa: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <Select
                    value={editing.category}
                    onValueChange={(v) => setEditing({ ...editing, category: v })}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMIN_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select
                    value={editing.status}
                    onValueChange={(v) =>
                      setEditing({ ...editing, status: v as AdminVehicleStatus })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="energy">Motorisation</Label>
                  <Input
                    id="energy"
                    className="mt-1.5"
                    value={editing.energy}
                    onChange={(e) => setEditing({ ...editing, energy: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="trans">Transmission</Label>
                  <Input
                    id="trans"
                    className="mt-1.5"
                    value={editing.transmission}
                    onChange={(e) => setEditing({ ...editing, transmission: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="km">Kilométrage (km)</Label>
                  <Input
                    id="km"
                    type="number"
                    className="mt-1.5"
                    value={editing.mileageKm}
                    onChange={(e) => setEditing({ ...editing, mileageKm: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="bat">Autonomie / batterie (si EV)</Label>
                  <Input
                    id="bat"
                    className="mt-1.5"
                    value={editing.battery ?? ""}
                    onChange={(e) => setEditing({ ...editing, battery: e.target.value })}
                    placeholder="Blade 71,8 kWh — 505 km"
                  />
                </div>
              </div>

              {/* Options module */}
              <div className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold">Options personnalisables</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setEditing({
                        ...editing,
                        options: [
                          ...editing.options,
                          { id: `opt-${Date.now()}`, label: "", price: 0 },
                        ],
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter une option
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  {editing.options.map((o, i) => (
                    <div key={o.id} className="flex gap-2">
                      <Input
                        value={o.label}
                        placeholder="Caméra 360°"
                        onChange={(e) => {
                          const next = [...editing.options];
                          next[i] = { ...o, label: e.target.value } as AdminOption;
                          setEditing({ ...editing, options: next });
                        }}
                      />
                      <Input
                        type="number"
                        className="w-40"
                        value={o.price}
                        onChange={(e) => {
                          const next = [...editing.options];
                          next[i] = { ...o, price: Number(e.target.value) } as AdminOption;
                          setEditing({ ...editing, options: next });
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Retirer l'option"
                        onClick={() =>
                          setEditing({
                            ...editing,
                            options: editing.options.filter((x) => x.id !== o.id),
                          })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {editing.options.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Aucune option. Exemple : « Chargeur rapide 7 kW (+ 250 000 FCFA) ».
                    </p>
                  )}
                </div>
              </div>

              {/* Media */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  toast.success("Image ajoutée à la galerie (démo).");
                }}
                className={`grid place-items-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  dragging ? "border-accent bg-accent/10" : "border-border"
                }`}
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm font-semibold">Glissez-déposez vos photos ici</p>
                <p className="text-xs text-muted-foreground">JPG ou PNG — 5 Mo max par image (démo)</p>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Mettre en vedette sur l'accueil</p>
                  <p className="text-xs text-muted-foreground">
                    Le véhicule apparaît dans la section « Véhicules en vedette ».
                  </p>
                </div>
                <Switch
                  checked={editing.featured}
                  onCheckedChange={(c) => setEditing({ ...editing, featured: c })}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Annuler
                </Button>
                <Button variant="accent" onClick={onSave}>
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
