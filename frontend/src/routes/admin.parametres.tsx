import { useState, useEffect, useRef, useMemo, type ChangeEvent } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  Upload,
  MapPin,
  Phone,
  Clock,
  Image as ImageIcon,
  Pencil,
  Search,
  AlertTriangle,
  Building2,
  Tag,
  Layers,
  Globe2,
  Palette,
  AtSign,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import {
  type Brand,
  type Category,
  type Agence,
  useAdminBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useAgences,
  useCreateAgence,
  useUpdateAgence,
  useDeleteAgence,
  useUploadImage,
  useSettings,
  useUpdateSettings,
} from "@/data/admin-store";

// ─────────────────────────────────────────────
// Types & helpers
// ─────────────────────────────────────────────
type PhoneEntry = { id: string; label: string; value: string };
type AddressEntry = { id: string; label: string; value: string };
type SocialEntry = { id: string; platform: string; url: string };

const SOCIAL_PLATFORMS = [
  { value: "Facebook", placeholder: "https://facebook.com/votre-page" },
  { value: "Instagram", placeholder: "https://instagram.com/votre-compte" },
  { value: "WhatsApp", placeholder: "https://wa.me/22997000000" },
  { value: "LinkedIn", placeholder: "https://linkedin.com/company/votre-societe" },
  { value: "X", placeholder: "https://x.com/votre-compte" },
  { value: "TikTok", placeholder: "https://tiktok.com/@votre-compte" },
  { value: "YouTube", placeholder: "https://youtube.com/@votre-chaine" },
  { value: "Telegram", placeholder: "https://t.me/votre-canal" },
] as const;

const urlPlaceholderFor = (platform: string) =>
  SOCIAL_PLATFORMS.find((p) => p.value === platform)?.placeholder ?? "https://…";

const displayPlatform = (platform: string) =>
  SOCIAL_PLATFORMS.some((p) => p.value === platform) ? platform : platform || "Choisir";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

type EntityRecord = {
  id?: string | number;
  is_active: boolean;
  name: string;
  [key: string]: string | number | boolean | null | undefined;
};

/** Les clés primaires du projet sont des uuid (chaînes) : on ne compare jamais à 0. */
const hasId = (item: EntityRecord): boolean =>
  typeof item.id === "number" ? item.id > 0 : Boolean(item.id);

interface ColumnConfig {
  key: string;
  label: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "url" | "number" | "textarea";
  placeholder?: string;
  required?: boolean;
}

interface EntityCrudCardProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  items: EntityRecord[];
  isLoading?: boolean;
  onSave: (item: EntityRecord, isEditing: boolean) => Promise<void>;
  onToggle: (id: string | number, active: boolean) => Promise<void>;
  onDelete: (id: string | number) => Promise<void>;
  searchPlaceholder?: string;
}

// ✅ Tiret supprimé : chaîne vide au lieu de "—"
const formatCellValue = (v: string | number | boolean | null | undefined): string => {
  if (v === null || v === undefined) return "";
  return String(v);
};

// ─────────────────────────────────────────────
// Section wrapper (titre + icône + description)
// ─────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-navy text-navy-foreground shadow-sm">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="font-display text-base font-extrabold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────
// Repeater row
// ─────────────────────────────────────────────
function RepeaterRow({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="group/row relative flex items-start gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/30">
      <div className="flex-1">{children}</div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={onRemove}
        aria-label="Supprimer"
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Image upload field
// ─────────────────────────────────────────────
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const mimes = (...values: string[]): string[] => values;

/** Formats alignés sur la validation `mimes:` de l'API (POST /admin/media/upload). */
const IMAGE_FORMATS = {
  png: { ext: "png", mime: mimes("image/png"), label: "PNG" },
  jpg: { ext: "jpg,jpeg", mime: mimes("image/jpeg"), label: "JPG" },
  webp: { ext: "webp", mime: mimes("image/webp"), label: "WebP" },
  gif: { ext: "gif", mime: mimes("image/gif"), label: "GIF" },
  svg: { ext: "svg", mime: mimes("image/svg+xml"), label: "SVG" },
  ico: {
    ext: "ico",
    mime: mimes("image/x-icon", "image/vnd.microsoft.icon"),
    label: "ICO",
  },
} as const;

type ImageFormatKey = keyof typeof IMAGE_FORMATS;

const LOGO_FORMATS: ImageFormatKey[] = ["png", "svg", "webp", "jpg"];
const FAVICON_FORMATS: ImageFormatKey[] = ["ico", "png", "svg", "webp", "jpg"];

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
    : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

const describeFormats = (formats: ImageFormatKey[]) =>
  formats.map((key) => IMAGE_FORMATS[key].label).join(", ");

const validateImageFile = (file: File, formats: ImageFormatKey[]): string | null => {
  if (file.size > MAX_UPLOAD_BYTES) {
    return `« ${file.name} » dépasse 5 Mo (${formatBytes(file.size)}).`;
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  const accepted = formats.some((key) => {
    const format = IMAGE_FORMATS[key];
    return (
      format.mime.includes(type) || format.ext.split(",").some((ext) => name.endsWith(`.${ext}`))
    );
  });

  if (!accepted) {
    return `Format non supporté pour « ${file.name} ». Formats acceptés : ${describeFormats(formats)}.`;
  }
  return null;
};

function ImageUploadField({
  id,
  label,
  hint,
  preview,
  shape = "square",
  formats = LOGO_FORMATS,
  isUploading = false,
  onFile,
  onRemove,
}: {
  id: string;
  label: string;
  hint?: string;
  preview?: string | null;
  shape?: "square" | "wide";
  formats?: ImageFormatKey[];
  isUploading?: boolean;
  onFile: (file: File) => void;
  onRemove?: () => void;
}) {
  const previewUrl = resolveImageUrl(preview);
  const acceptAttribute = formats
    .map((key) => IMAGE_FORMATS[key].ext.split(","))
    .flat()
    .map((ext) => `.${ext}`)
    .join(",");

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <div
          className={cn(
            "relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/50",
            shape === "wide" ? "h-20 w-52" : "h-16 w-16",
          )}
        >
          {previewUrl ? (
            <ImageWithFallback
              src={previewUrl}
              alt={`Aperçu : ${label}`}
              wrapperClassName="h-full w-full"
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
          {isUploading && (
            <span className="absolute inset-0 grid place-items-center bg-background/70 text-xs font-semibold text-muted-foreground">
              Envoi…
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label
            htmlFor={id}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:bg-secondary",
              isUploading && "pointer-events-none opacity-60",
            )}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {previewUrl ? "Remplacer" : "Choisir un fichier"}
          </label>

          {previewUrl && onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={isUploading}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Retirer
            </Button>
          )}
        </div>

        <input
          id={id}
          type="file"
          accept={acceptAttribute}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            const error = validateImageFile(file, formats);
            if (error) {
              toast.error(error);
              return;
            }
            onFile(file);
          }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Formats acceptés :</span>
        {formats.map((key) => (
          <span
            key={key}
            className="rounded-md border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase"
          >
            {IMAGE_FORMATS[key].ext}
          </span>
        ))}
        <span>· 5 Mo max</span>
      </div>

      {previewUrl && (
        <p className="mt-1.5 truncate text-xs text-muted-foreground">
          Source actuelle : {previewUrl}
        </p>
      )}

      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Generic CRUD card
// ─────────────────────────────────────────────
function EntityCrudCard({
  title,
  description,
  icon,
  columns,
  fields,
  items,
  isLoading = false,
  onSave,
  onToggle,
  onDelete,
  searchPlaceholder = "Rechercher…",
}: EntityCrudCardProps) {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<EntityRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntityRecord | null>(null);

  const emptyDraft = (): EntityRecord => ({
    is_active: true,
    name: "",
  });

  const openAdd = () => {
    setEditing(emptyDraft());
    setSheetOpen(true);
  };

  const openEdit = (item: EntityRecord) => {
    setEditing({ ...item });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!String(editing.name ?? "").trim()) {
      toast.error("Le nom est requis.");
      return;
    }
    await onSave(editing, hasId(editing));
    setSheetOpen(false);
    setEditing(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleteTarget.id === undefined) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  const filtered = useMemo(
    () =>
      search
        ? items.filter((it) => String(it.name).toLowerCase().includes(search.toLowerCase()))
        : items,
    [items, search],
  );

  return (
    <div className="surface-card p-5">
      <SectionHeader
        {...(icon ? { icon } : {})}
        title={title}
        {...(description ? { description } : {})}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground sm:inline-flex">
              {items.length}
            </span>
            <Button variant="accent" size="sm" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="mt-4 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.key}>{c.label}</TableHead>
                ))}
                <TableHead className="w-[90px]">Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className="text-sm">
                      {formatCellValue(item[c.key])}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Switch
                      checked={Boolean(item.is_active)}
                      onCheckedChange={(checked) => {
                        if (item.id !== undefined) onToggle(item.id, checked);
                      }}
                      aria-label={item.is_active ? "Désactiver" : "Activer"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Modifier"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Supprimer"
                        onClick={() => setDeleteTarget(item)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 3}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Aucun élément. Cliquez sur « Ajouter ».
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ── Sheet latéral droit, pleine hauteur ── */}
      <Sheet open={sheetOpen} onOpenChange={(o) => !o && setSheetOpen(false)}>
        <SheetContent side="right" className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg">
          <SheetHeader className="border-b border-border/60 px-6 py-4 text-left">
            <SheetTitle>{editing?.id ? `Modifier ${title}` : `Ajouter un/une ${title}`}</SheetTitle>
            <SheetDescription>
              {editing?.id
                ? `Modifiez les informations de cet élément.`
                : `Créez un nouvel élément pour ${title}.`}
            </SheetDescription>
          </SheetHeader>

          {editing && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid gap-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    <Label className="text-xs">
                      {f.label}
                      {f.required && " *"}
                    </Label>
                    {f.type === "textarea" ? (
                      <Textarea
                        className="mt-1.5"
                        rows={3}
                        placeholder={f.placeholder}
                        value={formatCellValue(editing[f.name])}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          setEditing({ ...editing, [f.name]: e.target.value })
                        }
                      />
                    ) : (
                      <Input
                        className="mt-1.5"
                        type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                        placeholder={f.placeholder}
                        value={formatCellValue(editing[f.name])}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setEditing({ ...editing, [f.name]: e.target.value })
                        }
                      />
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
                  <Label htmlFor="is_active" className="text-xs">
                    Actif sur le site
                  </Label>
                  <Switch
                    id="is_active"
                    checked={Boolean(editing.is_active)}
                    onCheckedChange={(c) => setEditing({ ...editing, is_active: c })}
                  />
                </div>
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-border/60 px-6 py-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Annuler
            </Button>
            <Button variant="accent" onClick={handleSave}>
              {editing?.id ? "Enregistrer" : "Créer"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.name}</span>. Cette
              action est <strong>irréversible</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteConfirm();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section wrappers (hook wiring)
// ─────────────────────────────────────────────
const BRAND_FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Nom de la marque",
    type: "text",
    placeholder: "Ex. HAVAL",
    required: true,
  },
  { name: "origin", label: "Pays d'origine", type: "text", placeholder: "Ex. Chine" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Description courte…",
  },
];

const BRAND_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nom" },
  { key: "origin", label: "Origine" },
  { key: "vehicles_count", label: "Véhicules" },
];

function BrandsSection() {
  const { data: brands = [], isLoading } = useAdminBrands();
  const createMut = useCreateBrand();
  const updateMut = useUpdateBrand();
  const deleteMut = useDeleteBrand();

  const handleSave = async (item: EntityRecord, isEditing: boolean) => {
    try {
      if (isEditing && item.id !== undefined) {
        await updateMut.mutateAsync({ id: item.id, data: item as Partial<Brand> });
      } else {
        const { id: _ignored, ...payload } = item;
        await createMut.mutateAsync(payload as Partial<Brand>);
      }
    } catch {}
  };

  const handleToggle = async (id: string | number, active: boolean) => {
    try {
      await updateMut.mutateAsync({ id, data: { is_active: active } });
    } catch {}
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch {}
  };

  return (
    <EntityCrudCard
      icon={Tag}
      title="Marques"
      description="Marques de véhicules proposées sur le site."
      columns={BRAND_COLUMNS}
      fields={BRAND_FIELDS}
      items={brands as EntityRecord[]}
      isLoading={isLoading}
      onSave={handleSave}
      onToggle={handleToggle}
      onDelete={handleDelete}
      searchPlaceholder="Rechercher une marque…"
    />
  );
}

const CATEGORY_FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Nom de la catégorie",
    type: "text",
    placeholder: "Ex. Minibus",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Description courte…",
  },
];

const CATEGORY_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nom" },
  { key: "vehicles_count", label: "Véhicules" },
];

function CategoriesSection() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  const handleSave = async (item: EntityRecord, isEditing: boolean) => {
    try {
      if (isEditing && item.id !== undefined) {
        await updateMut.mutateAsync({ id: item.id, data: item as Partial<Category> });
      } else {
        const { id: _ignored, ...payload } = item;
        await createMut.mutateAsync(payload as Partial<Category>);
      }
    } catch {}
  };

  const handleToggle = async (id: string | number, active: boolean) => {
    try {
      await updateMut.mutateAsync({ id, data: { is_active: active } });
    } catch {}
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch {}
  };

  return (
    <EntityCrudCard
      icon={Layers}
      title="Catégories"
      description="Catégories de véhicules (SUV, Berline, Pick-up, …)."
      columns={CATEGORY_COLUMNS}
      fields={CATEGORY_FIELDS}
      items={categories as EntityRecord[]}
      isLoading={isLoading}
      onSave={handleSave}
      onToggle={handleToggle}
      onDelete={handleDelete}
      searchPlaceholder="Rechercher une catégorie…"
    />
  );
}

const AGENCE_FIELDS: FieldConfig[] = [
  {
    name: "name",
    label: "Nom / Titre",
    type: "text",
    placeholder: "Ex. Agence de Cotonou",
    required: true,
  },
  {
    name: "location",
    label: "Localisation",
    type: "text",
    placeholder: "Ex. Boulevard de la Marina, Cotonou",
    required: true,
  },
  {
    name: "map_url",
    label: "Lien Google Maps",
    type: "url",
    placeholder: "https://maps.google.com/?q=…",
  },
  { name: "phone", label: "Téléphone", type: "text", placeholder: "+229 …" },
  {
    name: "hours",
    label: "Heures d'ouverture",
    type: "text",
    placeholder: "Lun – Sam : 8h00 – 19h00",
  },
];

const AGENCE_COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Nom" },
  { key: "location", label: "Localisation" },
  { key: "phone", label: "Téléphone" },
];

function AgencesCrud() {
  const { data: agences = [], isLoading } = useAgences();
  const createMut = useCreateAgence();
  const updateMut = useUpdateAgence();
  const deleteMut = useDeleteAgence();

  const handleSave = async (item: EntityRecord, isEditing: boolean) => {
    try {
      if (isEditing && item.id !== undefined) {
        await updateMut.mutateAsync({ id: item.id, data: item as Partial<Agence> });
      } else {
        const { id: _ignored, ...payload } = item;
        await createMut.mutateAsync(payload as Partial<Agence>);
      }
    } catch {}
  };

  const handleToggle = async (id: string | number, active: boolean) => {
    try {
      await updateMut.mutateAsync({ id, data: { is_active: active } });
    } catch {}
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMut.mutateAsync(id);
    } catch {}
  };

  return (
    <EntityCrudCard
      icon={Building2}
      title="Agences"
      description="Points de vente et de retrait."
      columns={AGENCE_COLUMNS}
      fields={AGENCE_FIELDS}
      items={agences as EntityRecord[]}
      isLoading={isLoading}
      onSave={handleSave}
      onToggle={handleToggle}
      onDelete={handleDelete}
      searchPlaceholder="Rechercher une agence…"
    />
  );
}

// ─────────────────────────────────────────────
// AdminSettings
// ─────────────────────────────────────────────
export function AdminSettings() {
  const [company, setCompany] = useState({
    name: "The Key Group Bénin",
    email: "[EMAIL_ADDRESS]",
    about:
      "Leader dans l'importation de véhicules en Afrique, The Key Group connecte le Bénin au monde automobile. Spécialisés dans l'achat et la vente de voitures neuves et d'occasion, nous offrons un service clé en main incluant le dédouanement, l'assurance et l'immatriculation. Notre expertise assure à chaque client l'accès aux meilleurs véhicules au meilleur tarif, avec un suivi transparent de la commande à la livraison finale. Basés au cœur du Bénin, nous sommes votre partenaire de confiance pour transformer le rêve automobile en réalité.",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const uploadImage = useUploadImage();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const settingsHydrated = useRef(false);

  // Hydrate local UI state from backend admin_settings (once).
  useEffect(() => {
    if (!settings || settingsHydrated.current) return;
    settingsHydrated.current = true;

    setCompany({
      name: (settings["site_name"] as string) ?? "AutoTrack Bénin",
      email: (settings["email_contact"] as string) ?? "mindsanni@gmail.com",
      about:
        (settings["site_about"] as string) ??
        "Importation de véhicules chinois neufs et d'occasion certifiée, avec suivi maritime jusqu'au Port de votre pays.",
    });

    const phonesVal = settings["phones"];
    if (Array.isArray(phonesVal) && phonesVal.length) {
      setPhones(phonesVal as PhoneEntry[]);
    }

    const addressesVal = settings["addresses"];
    if (Array.isArray(addressesVal) && addressesVal.length) {
      setAddresses(addressesVal as AddressEntry[]);
    }

    const socialsVal = settings["socials"];
    if (Array.isArray(socialsVal) && socialsVal.length) {
      setSocials(socialsVal as SocialEntry[]);
    }

    setLogoPreview((settings["site_logo"] as string | null | undefined) ?? null);
    setFaviconPreview((settings["site_favicon"] as string | null | undefined) ?? null);
  }, [settings]);

  const [phones, setPhones] = useState<PhoneEntry[]>([
    { id: uid(), label: "Standard", value: "+229 97 00 00 00" },
    { id: uid(), label: "WhatsApp", value: "+229 97 00 00 01" },
  ]);
  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: uid(), label: "Siège", value: "Calavi, Abomey-Calavi, Bénin" },
  ]);
  const [socials, setSocials] = useState<SocialEntry[]>([
    { id: uid(), platform: "Facebook", url: "https://facebook.com/easycar" },
    { id: uid(), platform: "WhatsApp", url: "https://wa.me/22997000000" },
  ]);

  const handleSaveAll = async () => {
    await updateSettings.mutateAsync({
      site_name: company.name,
      site_about: company.about,
      email_contact: company.email,
      phones,
      addresses,
      socials,
      site_logo: logoPreview,
      site_favicon: faviconPreview,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeading
        title="Configuration"
        subtitle="Catalogue, identité et coordonnées affichés sur le site public."
      />

      <Tabs defaultValue="catalogue" className="space-y-6">
        {/* ───── TabsList sticky ───── */}
        <div className="sticky top-16 z-30 -mx-4 border-b border-border/60 bg-secondary/60 px-4 py-3 backdrop-blur-lg lg:-mx-6 lg:px-6">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-xl bg-background/80 p-1 shadow-sm sm:w-auto">
            <TabsTrigger
              value="catalogue"
              className="gap-2 rounded-lg px-3.5 py-2 data-[state=active]:bg-gradient-navy data-[state=active]:text-navy-foreground data-[state=active]:shadow-sm"
            >
              <Tag className="h-4 w-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger
              value="agences"
              className="gap-2 rounded-lg px-3.5 py-2 data-[state=active]:bg-gradient-navy data-[state=active]:text-navy-foreground data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4" />
              Agences
            </TabsTrigger>
            <TabsTrigger
              value="identite"
              className="gap-2 rounded-lg px-3.5 py-2 data-[state=active]:bg-gradient-navy data-[state=active]:text-navy-foreground data-[state=active]:shadow-sm"
            >
              <Palette className="h-4 w-4" />
              Identité
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="gap-2 rounded-lg px-3.5 py-2 data-[state=active]:bg-gradient-navy data-[state=active]:text-navy-foreground data-[state=active]:shadow-sm"
            >
              <AtSign className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ══════════════ CATALOGUE ══════════════ */}
        <TabsContent value="catalogue" className="grid gap-4 xl:grid-cols-2">
          <BrandsSection />
          <CategoriesSection />
        </TabsContent>

        {/* ══════════════ AGENCES ══════════════ */}
        <TabsContent value="agences">
          <AgencesCrud />
        </TabsContent>

        {/* ══════════════ IDENTITÉ ══════════════ */}
        <TabsContent value="identite" className="space-y-4">
          <div className="surface-card p-5">
            <SectionHeader
              icon={Palette}
              title="Identité de la société"
              description="Nom, e-mail et présentation affichés publiquement."
            />

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la société</Label>
                  <Input
                    id="name"
                    className="mt-1.5"
                    value={company.name}
                    onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1.5"
                    value={company.email}
                    onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="about">Présentation courte</Label>
                  <Textarea
                    id="about"
                    rows={4}
                    className="mt-1.5"
                    value={company.about}
                    onChange={(e) => setCompany((c) => ({ ...c, about: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <ImageUploadField
                  id="logo"
                  label="Logo"
                  hint="Format horizontal 400×120px. Affiché dans l'en-tête du site public."
                  shape="wide"
                  formats={LOGO_FORMATS}
                  preview={logoPreview}
                  isUploading={uploadImage.isPending && uploadImage.variables?.type === "logo"}
                  onRemove={() => setLogoPreview(null)}
                  onFile={async (f) => {
                    try {
                      const res = await uploadImage.mutateAsync({ file: f, type: "logo" });
                      setLogoPreview(res.data.url);
                    } catch {
                      // handled by mutation toast
                    }
                  }}
                />
                <ImageUploadField
                  id="favicon"
                  label="Favicon"
                  hint="CARRÉ 32×32 ou 64×64px. Remplace l'icône de l'onglet du navigateur."
                  formats={FAVICON_FORMATS}
                  preview={faviconPreview}
                  isUploading={uploadImage.isPending && uploadImage.variables?.type === "favicon"}
                  onRemove={() => setFaviconPreview(null)}
                  onFile={async (f) => {
                    try {
                      const res = await uploadImage.mutateAsync({ file: f, type: "favicon" });
                      setFaviconPreview(res.data.url);
                    } catch {
                      // handled by mutation toast
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ══════════════ CONTACT ══════════════ */}
        <TabsContent value="contact" className="space-y-4">
          {/* ── Téléphones ── */}
          <div className="surface-card p-5">
            <SectionHeader
              icon={Phone}
              title="Téléphone / WhatsApp"
              description="Numéros affichés publiquement. Ajoutez-en autant que nécessaire."
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setPhones((p) => [...p, { id: uid(), label: "", value: "" }])}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              }
            />

            <div className="mt-4 space-y-2">
              {phones.map((p) => (
                <RepeaterRow
                  key={p.id}
                  onRemove={() => {
                    setPhones((arr) => arr.filter((x) => x.id !== p.id));
                    toast.success("Numéro supprimé.");
                  }}
                >
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                    <Input
                      placeholder="Libellé (ex. Standard)"
                      value={p.label}
                      onChange={(e) =>
                        setPhones((arr) =>
                          arr.map((x) => (x.id === p.id ? { ...x, label: e.target.value } : x)),
                        )
                      }
                    />
                    <Input
                      placeholder="+229 …"
                      value={p.value}
                      onChange={(e) =>
                        setPhones((arr) =>
                          arr.map((x) => (x.id === p.id ? { ...x, value: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                </RepeaterRow>
              ))}
              {phones.length === 0 && (
                <p className="rounded-xl border border-dashed py-6 text-center text-sm text-muted-foreground">
                  Aucun numéro. Cliquez sur « Ajouter ».
                </p>
              )}
            </div>
          </div>

          {/* ── Adresses ── */}
          <div className="surface-card p-5">
            <SectionHeader
              icon={MapPin}
              title="Adresses"
              description="Siège, entrepôt, points de retrait…"
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setAddresses((p) => [...p, { id: uid(), label: "", value: "" }])}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              }
            />

            <div className="mt-4 space-y-2">
              {addresses.map((a) => (
                <RepeaterRow
                  key={a.id}
                  onRemove={() => {
                    setAddresses((arr) => arr.filter((x) => x.id !== a.id));
                    toast.success("Adresse supprimée.");
                  }}
                >
                  <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                    <Input
                      placeholder="Libellé (ex. Siège)"
                      value={a.label}
                      onChange={(e) =>
                        setAddresses((arr) =>
                          arr.map((x) => (x.id === a.id ? { ...x, label: e.target.value } : x)),
                        )
                      }
                    />
                    <Input
                      placeholder="Adresse complète"
                      value={a.value}
                      onChange={(e) =>
                        setAddresses((arr) =>
                          arr.map((x) => (x.id === a.id ? { ...x, value: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                </RepeaterRow>
              ))}
              {addresses.length === 0 && (
                <p className="rounded-xl border border-dashed py-6 text-center text-sm text-muted-foreground">
                  Aucune adresse. Cliquez sur « Ajouter ».
                </p>
              )}
            </div>
          </div>

          {/* ── Réseaux sociaux ── */}
          <div className="surface-card p-5">
            <SectionHeader
              icon={Globe2}
              title="Réseaux sociaux"
              description="Liens vers vos pages officielles."
              action={
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() =>
                    setSocials((p) => [...p, { id: uid(), platform: "Facebook", url: "" }])
                  }
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              }
            />

            <div className="mt-4 space-y-2">
              {socials.map((s) => (
                <RepeaterRow
                  key={s.id}
                  onRemove={() => {
                    setSocials((arr) => arr.filter((x) => x.id !== s.id));
                    toast.success("Réseau supprimé.");
                  }}
                >
                  <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
                    <Select
                      value={displayPlatform(s.platform)}
                      onValueChange={(value) =>
                        setSocials((arr) =>
                          arr.map((x) => (x.id === s.id ? { ...x, platform: value } : x)),
                        )
                      }
                    >
                      <SelectTrigger aria-label="Plateforme">
                        <SelectValue placeholder="Choisir une plateforme" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder={urlPlaceholderFor(s.platform)}
                      value={s.url}
                      onChange={(e) =>
                        setSocials((arr) =>
                          arr.map((x) => (x.id === s.id ? { ...x, url: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                </RepeaterRow>
              ))}
              {socials.length === 0 && (
                <p className="rounded-xl border border-dashed py-6 text-center text-sm text-muted-foreground">
                  Aucun réseau. Cliquez sur « Ajouter ».
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Barre d'action fixe en bas ── */}
      <div className="sticky bottom-4 z-30 flex justify-end">
        <Button
          variant="accent"
          size="lg"
          disabled={updateSettings.isPending}
          onClick={handleSaveAll}
          className="shadow-lg shadow-primary/20"
        >
          <Save className="h-4 w-4" />
          Enregistrer la configuration
        </Button>
      </div>
    </div>
  );
}
