import { useEffect, useMemo, useRef, useState } from "react";
import { useSearch, useNavigate } from "@/lib/router";
import {
  AlertTriangle,
  Eye,
  Pencil,
  Search,
  Trash2,
  Plus,
  X,
  ImagePlus,
  Loader2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Car,
  Tag as TagIcon,
  FileText,
  Image as ImageIcon,
  Settings2,
  Sparkles,
  Check,
  Gauge,
  Fuel,
  Users,
  InfoIcon,
  BarChart3,
  Clock,
  MousePointerClick,
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { VehicleStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  fcfa,
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useAdminBrands,
  useAdminCategories,
  useVehicleStatuses,
  useVehicleEnergyTypes,
  useVehicleTransmissionTypes,
  useSyncVehicleOptions,
  useVehicleStats,
  useDeleteVehicleOption,
  useUploadVehicleImages,
  useDeleteVehicleImage,
  type Vehicle,
  type VehicleOption,
  type VehicleImage,
} from "@/data/admin-store";
import { IMAGE_FALLBACK, vehicleImageUrl } from "@/lib/image";

/** Couverture d'un véhicule, avec l'image de substitution du catalogue. */
const coverOf = (vehicle: Vehicle) => vehicleImageUrl(vehicle) ?? IMAGE_FALLBACK;

const PER_PAGE = 5;
const MAX_IMAGES = 7;

const emptyVehicle = (): Vehicle => ({
  id: 0,
  slug: "",
  brand: "BYD",
  brand_id: null,
  model: "",
  category: "SUV",
  category_id: null,
  condition: "Neuf",
  year: 2026,
  mileage_km: 0,
  energy: "Essence",
  transmission: "Manuel",
  nombre_places: 5,
  engine: "",
  consumption: "",
  price_fcfa: 0,
  badge: null,
  status: "En Stock",
  featured: false,
  highlights: [],
  vehicle_images: [],
  options: [],
  description: null,
  created_at: null,
  updated_at: null,
});
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─────────────────────────────────────────────
// Section Title
// ─────────────────────────────────────────────
function SectionTitle({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: React.ElementType;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-tight">{title}</h3>
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─────────────────────────────────────────────
// Field
// ─────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Info Row
// ─────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold">{value}</dd>
    </div>
  );
}

// ─────────────────────────────────────────────
// Stat Card (interne — utilisé dans les stats par véhicule)
// ─────────────────────────────────────────────
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/40 px-4 py-5 text-center">
      <span className="mb-2 grid h-9 w-9 place-items-center rounded-lg bg-background text-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="font-display text-2xl font-extrabold tracking-tight">{value}</span>
      <span className="mt-0.5 text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Overview Stat Card (nouvelles cards globales du catalogue)
// ─────────────────────────────────────────────
function OverviewStatCard({
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

// ─────────────────────────────────────────────
// Panneau de statistiques (30 derniers jours)
// ─────────────────────────────────────────────
const formatDuration = (seconds: number) => {
  if (!seconds || seconds < 60) return `${Math.round(seconds || 0)} s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

function VehicleStatsPanel({ vehicleId }: { vehicleId: number }) {
  const { data, isLoading } = useVehicleStats(vehicleId, 30);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-secondary/60" />
        ))}
      </div>
    );
  }

  const totals = data?.totals;
  const maxViews = Math.max(1, ...(data?.timeline ?? []).map((p) => p.views));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          value={new Intl.NumberFormat("fr-FR").format(totals?.views ?? 0)}
          label="Consultations (30 j)"
        />
        <StatCard
          icon={Users}
          value={new Intl.NumberFormat("fr-FR").format(totals?.visitors ?? 0)}
          label="Visiteurs uniques"
        />
        <StatCard
          icon={Clock}
          value={formatDuration(totals?.avg_duration_seconds ?? 0)}
          label="Temps d'affichage moyen"
        />
        <StatCard
          icon={MousePointerClick}
          value={new Intl.NumberFormat("fr-FR").format(totals?.clicks ?? 0)}
          label="Clics"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold">Consultations par jour</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          30 derniers jours — {totals?.clicks_per_view ?? 0} clic / vue
        </p>
        <div className="mt-4 flex h-32 items-end gap-[3px]">
          {(data?.timeline ?? []).map((point) => (
            <div
              key={point.day}
              title={`${point.label ?? point.day} — ${point.views} vue(s)`}
              className="group relative flex-1 rounded-t bg-accent/70 transition-colors hover:bg-accent"
              style={{
                height: `${Math.max(4, (point.views / maxViews) * 100)}%`,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>{data?.timeline?.[0]?.label}</span>
          <span>{data?.timeline?.[data.timeline.length - 1]?.label}</span>
        </div>
      </div>

      {data && data.referrers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">Origines des visites</h3>
          <div className="mt-3 space-y-2">
            {data.referrers.map((r) => (
              <div
                key={r.host}
                className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2"
              >
                <span className="truncate text-xs font-medium">{r.host}</span>
                <span className="text-xs font-bold">
                  {new Intl.NumberFormat("fr-FR").format(r.views)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(totals?.views ?? 0) === 0 && (
        <p className="rounded-xl border border-dashed border-border/60 bg-secondary/20 px-4 py-8 text-center text-xs text-muted-foreground">
          Aucune consultation enregistrée pour ce véhicule sur la période.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Carrousel d'images
// ─────────────────────────────────────────────
function ImageCarousel({ images }: { images: VehicleImage[] }) {
  const [index, setIndex] = useState(0);
  const total = images.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  if (total === 0) {
    return (
      <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-border bg-secondary/30 text-xs text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          Aucune image disponible
        </div>
      </div>
    );
  }

  const current = images[index];
  const currentUrl = vehicleImageUrl({ vehicle_images: images }, index);

  return (
    <div className="space-y-2.5">
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-secondary/10">
        <img
          key={current.id}
          src={currentUrl}
          alt={`Image ${index + 1}`}
          className="h-full w-full object-contain transition-all duration-300"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
          {index + 1} / {total}
        </span>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Image précédente"
              className="absolute left-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Image suivante"
              className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-background group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === index
                ? "border-accent ring-2 ring-accent/20"
                : "border-border opacity-60 hover:opacity-100"
                }`}
            >
              <img
                src={vehicleImageUrl({ vehicle_images: images }, i)}
                alt={`Miniature ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Drag & Drop Zone
// ─────────────────────────────────────────────
function ImageDropzone({
  onFiles,
  maxFiles = MAX_IMAGES,
  currentCount = 0,
  isUploading = false,
}: {
  onFiles: (files: File[]) => void;
  maxFiles?: number;
  currentCount?: number;
  isUploading?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = maxFiles - currentCount;
  const isDisabled = isUploading || remaining <= 0;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) {
      toast.error("Seules les images sont acceptées.");
      return;
    }
    if (arr.length > remaining) {
      toast.error(`Vous pouvez uploader au plus ${remaining} image(s) supplémentaire(s).`);
      return;
    }
    onFiles(arr);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDisabled) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (isDisabled) return;
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !isDisabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-disabled={isDisabled}
      className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200 ${isDisabled
        ? "cursor-not-allowed border-border/60 bg-secondary/30 opacity-60"
        : isDragging
          ? "scale-[1.01] border-accent bg-accent/5 shadow-lg shadow-accent/10"
          : "border-border bg-secondary/20 hover:border-accent/60 hover:bg-accent/5"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={isDisabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <span
        className={`grid h-10 w-10 place-items-center rounded-full transition-all duration-200 ${isDragging
          ? "scale-110 bg-accent text-accent-foreground"
          : "bg-secondary text-muted-foreground"
          }`}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ImagePlus className="h-5 w-5" />
        )}
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {isUploading
            ? "Envoi en cours…"
            : isDragging
              ? "Déposez les images ici"
              : "Glissez-déposez vos images"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          ou{" "}
          <span className="font-semibold text-accent underline-offset-2 hover:underline">
            parcourir vos fichiers
          </span>
        </p>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          JPG, PNG, WEBP — 5 Mo max · {remaining} emplacement
          {remaining > 1 ? "s" : ""} restant{remaining > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Galerie d'images
// ─────────────────────────────────────────────
function VehicleGallery({
  images,
  pendingImages = [],
  onDelete,
  onDeletePending,
  onUpload,
  isUploading,
}: {
  images: VehicleImage[];
  pendingImages?: File[];
  onDelete: (img: VehicleImage) => void;
  onDeletePending: (index: number) => void;
  onUpload: (files: File[]) => void;
  isUploading: boolean;
}) {
  const allImages = [...images, ...pendingImages];
  const hasImages = allImages.length > 0;
  const canUpload = allImages.length < MAX_IMAGES;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Galerie d'images</h3>
        <span className="text-xs text-muted-foreground">
          {allImages.length}/{MAX_IMAGES} images
          {pendingImages.length > 0 && (
            <span className="ml-1.5 text-accent">({pendingImages.length} en attente)</span>
          )}
        </span>
      </div>

      {hasImages && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40"
            >
              <img
                src={img.url}
                alt={`Image ${i + 1}`}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-sm">
                  Principale
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <button
                type="button"
                onClick={() => onDelete(img)}
                aria-label={`Supprimer l'image ${i + 1}`}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-destructive opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {pendingImages.map((file, i) => (
            <div
              key={`pending-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary/40"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Image en attente ${i + 1}`}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute left-1.5 top-1.5 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                En attente
              </span>
              <button
                type="button"
                onClick={() => onDeletePending(i)}
                aria-label={`Supprimer l'image en attente ${i + 1}`}
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-background/90 text-destructive opacity-0 shadow-md backdrop-blur-sm transition-all hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {canUpload ? (
        <ImageDropzone
          currentCount={allImages.length}
          maxFiles={MAX_IMAGES}
          isUploading={isUploading}
          onFiles={onUpload}
        />
      ) : (
        <p className="text-xs text-muted-foreground">Limite de {MAX_IMAGES} images atteinte.</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// AdminCatalogue
// ─────────────────────────────────────────────
export function AdminCatalogue() {
  const search = useSearch();
  const navigate = useNavigate();
  const {
    data: vehiclesData,
    isLoading,
    refetch,
  } = useVehicles({
    page: "1",
    per_page: "100",
  });
  const vehicles = vehiclesData?.data ?? [];

  const { data: adminBrandsData } = useAdminBrands();
  const { data: adminCategoriesData } = useAdminCategories();
  const { data: statusesData } = useVehicleStatuses();
  const { data: energyTypesData } = useVehicleEnergyTypes();
  const { data: transmissionTypesData } = useVehicleTransmissionTypes();
  const adminBrands = adminBrandsData ?? [];
  const adminCategories = adminCategoriesData ?? [];
  const statuses = statusesData ?? [];
  const energyTypes = energyTypesData ?? [];
  const transmissionTypes = transmissionTypesData ?? [];

  const createMut = useCreateVehicle();
  const updateMut = useUpdateVehicle();
  const deleteMut = useDeleteVehicle();
  const syncOptionsMut = useSyncVehicleOptions();
  const deleteOptionMut = useDeleteVehicleOption();
  const uploadImagesMut = useUploadVehicleImages();
  const deleteImageMut = useDeleteVehicleImage();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [optionInputs, setOptionInputs] = useState<VehicleOption[]>([]);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [viewing, setViewing] = useState<Vehicle | null>(null);
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);

  const stats = useMemo(() => {
    const enStock = vehicles.filter((v) => v.status === "En Stock").length;
    const surCommande = vehicles.filter((v) => v.status === "Sur commande").length;
    const featured = vehicles.filter((v) => v.featured).length;
    return {
      total: vehicles.length,
      enStock,
      surCommande,
      featured,
    };
  }, [vehicles]);

  useEffect(() => {
    if (search["new"]) {
      setEditing({ ...emptyVehicle() });
      setPendingImages([]);
      const { new: _, ...rest } = search;
      navigate("", { search: rest, replace: true });
    }
  }, [search["new"], navigate, search]);

  useEffect(() => {
    const editId = search["edit"];
    if (editId) {
      const vehicle = vehicles.find((v) => String(v.id) === editId);
      if (vehicle) {
        setEditing(vehicle);
        setPendingImages([]);
      } else {
        const { edit: _, ...rest } = search;
        navigate("", { search: rest, replace: true });
      }
    }
  }, [search["edit"], vehicles, navigate, search]);

  useEffect(() => {
    if (editing) {
      setOptionInputs(
        editing.options?.map((o) => ({
          id: o.id,
          vehicle_id: editing.id,
          label: o.label,
          price: o.price,
          option_key: o.option_key ?? null,
        })) ?? [],
      );
    }
  }, [editing]);

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

  const onSave = async () => {
    if (!editing) return;
    if (!editing.model.trim() || editing.price_fcfa <= 0) {
      toast.error("Renseignez au moins le modèle et un prix valide.");
      return;
    }
    try {
      const payload = { ...editing, options: optionInputs };
      if (editing.id > 0) {
        await updateMut.mutateAsync({ id: editing.id, data: payload });
        if (pendingImages.length > 0) {
          await uploadImagesMut.mutateAsync({
            vehicleId: editing.id,
            files: pendingImages,
          });
          setPendingImages([]);
        }
        refetch();
        setEditing(null);
      } else {
        const result = await createMut.mutateAsync(payload);
        const saved = result.data;
        if (pendingImages.length > 0) {
          await uploadImagesMut.mutateAsync({
            vehicleId: saved.id,
            files: pendingImages,
          });
          setPendingImages([]);
        }
        toast.success(`${saved.brand} ${saved.model} créé avec succès.`);
        refetch();
        setEditing(null);
      }
    } catch {
      // error handled by mutation
    }
  };

  const syncOptions = async () => {
    if (!editing || editing.id === 0) {
      toast.error("Enregistrez d'abord le véhicule.");
      return;
    }
    try {
      await syncOptionsMut.mutateAsync({
        vehicleId: editing.id,
        options: optionInputs,
      });
      refetch();
    } catch {
      // error handled by mutation
    }
  };

  const addOption = () => {
    setOptionInputs([
      ...optionInputs,
      { id: 0, vehicle_id: 0, label: "", price: 0, option_key: null },
    ]);
  };

  const updateOption = (index: number, field: "label" | "price", value: string | number) => {
    const next = [...optionInputs];
    next[index] = { ...next[index], [field]: value };
    setOptionInputs(next);
  };

  const removeOption = (index: number) => {
    const option = optionInputs[index];
    if (option && option.id > 0 && editing && editing.id > 0) {
      deleteOptionMut.mutateAsync({
        vehicleId: editing.id,
        optionId: option.id,
      });
    }
    setOptionInputs(optionInputs.filter((_, i) => i !== index));
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteMut.mutateAsync(toDelete.id);
      toast.success(`${toDelete.brand} ${toDelete.model} supprimé du catalogue.`);
      refetch();
    } catch {
      toast.error("Impossible de supprimer ce véhicule.");
    } finally {
      setToDelete(null);
    }
  };

  const handleUploadImages = async (files: File[]) => {
    if (!editing) return;
    if (editing.id === 0) {
      setPendingImages((prev) => [...prev, ...files]);
      toast.success(`${files.length} image${files.length > 1 ? "s" : ""} en attente d'envoi.`);
      return;
    }
    try {
      await uploadImagesMut.mutateAsync({ vehicleId: editing.id, files });
      refetch();
      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} ajoutée${files.length > 1 ? "s" : ""}.`,
      );
    } catch {
      // error handled by mutation
    }
  };

  const handleDeleteImage = async (img: VehicleImage) => {
    if (!editing || editing.id === 0) return;
    try {
      await deleteImageMut.mutateAsync({
        vehicleId: editing.id,
        imageId: img.id,
      });
      setEditing({
        ...editing,
        vehicle_images: editing.vehicle_images.filter((i) => i.id !== img.id),
      });
      toast.success("Image supprimée.");
    } catch {
      toast.error("Impossible de supprimer cette image.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeading title="Gestion du catalogue" subtitle="Chargement..." />
        <div className="surface-card p-8 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="relative pb-6">
      <PageHeading
        title="Gestion du catalogue"
        subtitle="Inventaire des véhicules importés de Chine proposés à la vente."
      />

      {/* ═══════════════════════════════════════════════════════════
          CARDS STATISTIQUES
      ═══════════════════════════════════════════════════════════ */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewStatCard icon={Car} label="Total véhicules" value={stats.total} />
        <OverviewStatCard icon={Package} label="En stock" value={stats.enStock} />
        <OverviewStatCard icon={Truck} label="Sur commande" value={stats.surCommande} />
        <OverviewStatCard icon={Sparkles} label="Mis en vedette" value={stats.featured} />
      </div>

      <div className="surface-card p-4 sm:p-5">
        {/* ===================== FILTRES ===================== */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <select
              value={cat}
              onChange={(e) => {
                setCat(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm font-medium outline-none transition-colors focus:border-primary/50"
            >
              <option value="all">Toutes les catégories</option>
              {adminCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm font-medium outline-none transition-colors focus:border-primary/50"
            >
              <option value="all">Tous les statuts</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative sm:col-span-2 lg:col-span-1">
            <select
              className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 pr-8 text-sm font-medium outline-none transition-colors focus:border-primary/50"
              defaultValue="all"
            >
              <option value="all">Toutes les énergies</option>
              {energyTypes.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* ===================== TOOLBAR ===================== */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un véhicule"
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                className="h-10 appearance-none rounded-md border border-border bg-background pl-3 pr-8 text-sm font-medium outline-none transition-colors focus:border-primary/50"
                defaultValue="5"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>

            <button
              onClick={() => setEditing({ ...emptyVehicle() })}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:flex-none"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter un véhicule</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        </div>

        {/* ===================== VUE MOBILE — CARDS ===================== */}
        <div className="mt-4 space-y-3 md:hidden">
          {rows.map((v) => (
            <div
              key={v.id}
              onClick={() => setViewing(v)}
              className="cursor-pointer overflow-hidden rounded-xl border border-border bg-background p-3 transition-all active:scale-[0.99]"
            >
              <div className="flex gap-3">
                <img
                  src={coverOf(v)}
                  alt={`${v.brand} ${v.model}`}
                  className="h-20 w-24 shrink-0 rounded-lg border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {v.brand}{" "}
                        <span className="font-normal text-muted-foreground">{v.model}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {v.year} · {v.category} · {v.energy}
                      </p>
                    </div>
                    {v.featured && <span className="shrink-0 text-xs text-accent">★</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold">{fcfa(v.price_fcfa)}</p>
                    <VehicleStatusBadge status={v.status} />
                  </div>
                </div>
              </div>

              <div
                className="mt-3 flex items-center justify-end gap-1 border-t border-border pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setViewing(v)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Voir
                </button>
                <button
                  onClick={() => setEditing(v)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Modifier
                </button>
                <button
                  onClick={() => setToDelete(v)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-sm font-medium">Aucun véhicule trouvé</p>
              <p className="text-xs text-muted-foreground">Essayez de modifier vos filtres.</p>
            </div>
          )}
        </div>

        {/* ===================== VUE DESKTOP — TABLE ===================== */}
        <div className="mt-4 hidden overflow-x-auto rounded-lg border border-border md:block">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Véhicule
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Catégorie
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">
                  Énergie
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground xl:table-cell">
                  Créé
                </th>
                <th className="w-[120px] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr
                  key={v.id}
                  className="border-b border-border/60 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={coverOf(v)}
                        alt={`${v.brand} ${v.model}`}
                        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold leading-tight">
                          {v.brand} {v.model}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {v.year} · {v.nombre_places} places
                          {v.featured && <span className="ml-1.5 text-accent">★</span>}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      {v.category}
                    </span>
                  </td>

                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      {v.energy}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-sm font-medium">{fcfa(v.price_fcfa)}</span>
                  </td>

                  <td className="px-4 py-3">
                    <VehicleStatusBadge status={v.status} />
                  </td>

                  <td className="hidden px-4 py-3 xl:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {v.created_at
                        ? new Date(v.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-0.5">
                      <button
                        onClick={() => setViewing(v)}
                        aria-label="Voir"
                        className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setToDelete(v)}
                        aria-label="Supprimer"
                        className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditing(v)}
                        aria-label="Modifier"
                        title="Modifier"
                        className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm text-muted-foreground">
                    Aucun véhicule trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================== PAGINATION ===================== */}
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {filtered.length} véhicule(s) — page {current} / {pages}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
              className="flex-1 sm:flex-none"
            >
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
              className="flex-1 sm:flex-none"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* ============ DRAWER VOIR ============ */}
      <Sheet open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-hidden border-l border-border/60 bg-background p-0 sm:max-w-2xl"
        >
          {viewing && (
            <>
              {/* ─── Header enrichi ─── */}
              <div className="relative overflow-hidden border-b border-border/60">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/60 via-transparent to-transparent" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative px-5 py-5 sm:px-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={coverOf(viewing)}
                      alt={viewing.model}
                      className="h-14 w-14 shrink-0 rounded-2xl border-2 border-background object-cover shadow-md"
                    />

                    <div className="min-w-0 flex-1">
                      <SheetTitle className="font-display text-lg font-extrabold tracking-tight sm:text-xl">
                        {viewing.brand} {viewing.model}
                      </SheetTitle>
                      <SheetDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                        <span>{viewing.year}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span>{viewing.category}</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                        <span>{viewing.energy}</span>
                      </SheetDescription>

                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <VehicleStatusBadge status={viewing.status} />
                        {viewing.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                            <Sparkles className="h-3 w-3" />
                            Vedette
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Tabs ─── */}
              <Tabs defaultValue="apercu" className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-border/60 bg-background/95 px-5 backdrop-blur-sm sm:px-6">
                  <TabsList className="h-auto w-full justify-start gap-0.5 overflow-x-auto rounded-none bg-transparent p-0">
                    <TabsTrigger
                      value="apercu"
                      className="gap-2 rounded-none border-b-2 border-transparent px-3.5 pb-3 pt-3 text-[13px] font-semibold data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      <InfoIcon className="h-3.5 w-3.5" />
                      Aperçu
                    </TabsTrigger>
                    <TabsTrigger
                      value="galerie"
                      className="gap-2 rounded-none border-b-2 border-transparent px-3.5 pb-3 pt-3 text-[13px] font-semibold data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Galerie
                      {(viewing.vehicle_images?.length ?? 0) > 0 && (
                        <span className="ml-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                          {viewing.vehicle_images.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="options"
                      className="gap-2 rounded-none border-b-2 border-transparent px-3.5 pb-3 pt-3 text-[13px] font-semibold data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      <TagIcon className="h-3.5 w-3.5" />
                      Options
                      {viewing.options.length > 0 && (
                        <span className="ml-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                          {viewing.options.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="description"
                      className="gap-2 rounded-none border-b-2 border-transparent px-3.5 pb-3 pt-3 text-[13px] font-semibold data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="stats"
                      className="gap-2 rounded-none border-b-2 border-transparent px-3.5 pb-3 pt-3 text-[13px] font-semibold data-[state=active]:border-accent data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      Statistiques
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* ── TAB APERÇU ── */}
                  <TabsContent value="apercu" className="m-0 p-5 sm:p-7">
                    <div className="space-y-6">
                      <div className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent p-5">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/20 blur-3xl" />
                        <p className="relative text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                          Prix de base
                        </p>
                        <p className="relative mt-1.5 font-display text-3xl font-extrabold tracking-tight">
                          {fcfa(viewing.price_fcfa)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <StatCard icon={Users} value={`${viewing.nombre_places}`} label="Places" />
                        <StatCard
                          icon={Gauge}
                          value={new Intl.NumberFormat("fr-FR").format(viewing.mileage_km)}
                          label="Km"
                        />
                        <StatCard
                          icon={ImageIcon}
                          value={`${viewing.vehicle_images?.length ?? 0}`}
                          label="Photos"
                        />
                      </div>

                      <section>
                        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Caractéristiques
                        </h3>
                        <dl className="rounded-xl border border-border/60 bg-card px-4">
                          <InfoRow label="Marque" value={viewing.brand} />
                          <InfoRow label="Modèle" value={viewing.model} />
                          <InfoRow label="Année" value={String(viewing.year)} />
                          <InfoRow label="Catégorie" value={viewing.category} />
                          <InfoRow
                            label="État"
                            value={
                              <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {viewing.condition}
                              </span>
                            }
                          />
                          <InfoRow
                            label="Énergie"
                            value={
                              <span className="inline-flex items-center gap-1.5">
                                <Fuel className="h-3.5 w-3.5 text-muted-foreground" />
                                {viewing.energy}
                              </span>
                            }
                          />
                          <InfoRow
                            label="Transmission"
                            value={
                              <span className="inline-flex items-center gap-1.5">
                                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                                {viewing.transmission}
                              </span>
                            }
                          />
                          <InfoRow
                            label="Kilométrage"
                            value={`${new Intl.NumberFormat("fr-FR").format(viewing.mileage_km)} km`}
                          />
                          {viewing.created_at && (
                            <InfoRow
                              label="Ajouté le"
                              value={new Date(viewing.created_at).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            />
                          )}
                        </dl>
                      </section>
                    </div>
                  </TabsContent>

                  {/* ── TAB GALERIE ── */}
                  <TabsContent value="galerie" className="m-0 p-5 sm:p-7">
                    <ImageCarousel images={viewing.vehicle_images ?? []} />
                  </TabsContent>

                  {/* ── TAB OPTIONS ── */}
                  <TabsContent value="options" className="m-0 p-5 sm:p-7">
                    {viewing.options.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-secondary/20 py-16 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                          <TagIcon className="h-6 w-6 text-muted-foreground/50" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">Aucune option</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Ce véhicule n'a pas d'options additionnelles.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {viewing.options.map((o) => (
                          <li
                            key={o.id}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-all hover:border-accent/40 hover:bg-accent/5"
                          >
                            <span className="flex items-center gap-3">
                              <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent">
                                <Check className="h-3.5 w-3.5" />
                              </span>
                              <span className="text-sm font-medium">{o.label}</span>
                            </span>
                            <span className="text-sm font-bold text-accent">+ {fcfa(o.price)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TabsContent>

                  {/* ── TAB DESCRIPTION ── */}
                  <TabsContent value="description" className="m-0 p-5 sm:p-7">
                    {viewing.description ? (
                      <div
                        className="prose prose-sm max-w-none rounded-xl border border-border/60 bg-secondary/20 p-5 text-sm leading-relaxed text-foreground 
                    prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-bold prose-headings:text-foreground 
                    prose-p:my-2 prose-p:text-muted-foreground
                    prose-ul:my-2 prose-li:my-0.5 prose-li:text-muted-foreground
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: viewing.description }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-secondary/20 py-16 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
                          <FileText className="h-6 w-6 text-muted-foreground/50" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">Aucune description</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Ce véhicule n'a pas encore de description.
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="stats" className="m-0 p-5 sm:p-7">
                    <VehicleStatsPanel vehicleId={viewing.id} />
                  </TabsContent>
                </div>
              </Tabs>

              {/* ─── Footer ─── */}
              <SheetFooter className="border-t border-border/60 bg-background/95 px-5 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Ajouté le{" "}
                  {viewing.created_at
                    ? new Date(viewing.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "—"}
                </p>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl sm:flex-none"
                    onClick={() => setViewing(null)}
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="accent"
                    className="flex-1 rounded-xl shadow-lg shadow-accent/20 sm:flex-none"
                    onClick={() => {
                      setEditing(viewing);
                      setViewing(null);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ============ DRAWER AJOUT / ÉDITION ============ */}
      <Sheet
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) {
            setEditing(null);
            setPendingImages([]);
          }
        }}
      >
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 overflow-hidden border-l border-border/60 bg-background p-0 sm:max-w-2xl"
        >
          {editing && (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <SheetTitle className="truncate text-base font-bold sm:text-lg">
                    {editing.id > 0 ? "Modifier le véhicule" : "Ajouter un véhicule"}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs text-muted-foreground">
                    Renseignez les informations générales et techniques.
                  </SheetDescription>
                </div>
                <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                  {editing.id > 0 ? "Édition" : "Nouveau"}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-7 p-5 sm:p-6">
                  {/* Section 1 */}
                  <section className="space-y-4">
                    <SectionTitle
                      icon={Car}
                      title="Informations générales"
                      hint="Identité du véhicule et prix"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Marque">
                        <Select
                          value={editing.brand}
                          onValueChange={(v) => setEditing({ ...editing, brand: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {adminBrands.map((b) => (
                              <SelectItem key={b.id} value={b.name}>
                                {b.name}
                              </SelectItem>
                            ))}
                            {adminBrands.length === 0 && (
                              <SelectItem value={editing.brand} disabled>
                                {editing.brand || "Chargement..."}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Modèle">
                        <Input
                          value={editing.model}
                          onChange={(e) => setEditing({ ...editing, model: e.target.value })}
                          placeholder="Song Plus EV"
                        />
                      </Field>

                      <Field label="Année">
                        <Input
                          type="number"
                          value={editing.year}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              year: Number(e.target.value),
                            })
                          }
                        />
                      </Field>

                      <Field label="Prix (FCFA)">
                        <Input
                          type="number"
                          value={editing.price_fcfa}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              price_fcfa: Number(e.target.value),
                            })
                          }
                        />
                      </Field>

                      <Field label="Catégorie">
                        <Select
                          value={editing.category}
                          onValueChange={(v) => setEditing({ ...editing, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {adminCategories.map((c) => (
                              <SelectItem key={c.id} value={c.name}>
                                {c.name}
                              </SelectItem>
                            ))}
                            {adminCategories.length === 0 && (
                              <SelectItem value={editing.category} disabled>
                                {editing.category || "Chargement..."}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Statut">
                        <Select
                          value={editing.status}
                          onValueChange={(v) =>
                            setEditing({
                              ...editing,
                              status: v as Vehicle["status"],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </section>

                  {/* Section 2 */}
                  <section className="space-y-4">
                    <SectionTitle
                      icon={Settings2}
                      title="Spécifications techniques"
                      hint="Motorisation et caractéristiques"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Énergie">
                        <Select
                          value={editing.energy}
                          onValueChange={(v) => setEditing({ ...editing, energy: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {energyTypes.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                            {energyTypes.length === 0 && (
                              <SelectItem value={editing.energy} disabled>
                                {editing.energy || "Chargement..."}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Transmission">
                        <Select
                          value={editing.transmission}
                          onValueChange={(v) => setEditing({ ...editing, transmission: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissionTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                            {transmissionTypes.length === 0 && (
                              <SelectItem value={editing.transmission} disabled>
                                {editing.transmission || "Chargement..."}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </Field>

                      <Field label="Kilométrage (km)">
                        <Input
                          type="number"
                          min={0}
                          value={editing.mileage_km}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              mileage_km: Number(e.target.value),
                            })
                          }
                        />
                      </Field>

                      <Field label="Nombre de places">
                        <Input
                          type="number"
                          min={2}
                          max={7}
                          value={editing.nombre_places}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              nombre_places: Number(e.target.value),
                            })
                          }
                          placeholder="2 à 7"
                        />
                      </Field>
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section className="space-y-4">
                    <SectionTitle
                      icon={FileText}
                      title="Description"
                      hint="Texte affiché sur la fiche véhicule"
                    />
                    <RichTextEditor
                      value={editing.description ?? ""}
                      onChange={(html) => setEditing({ ...editing, description: html })}
                      placeholder="Description détaillée du véhicule…"
                    />
                  </section>

                  {/* Section 4 */}
                  <section className="space-y-4">
                    <SectionTitle
                      icon={ImageIcon}
                      title="Galerie d'images"
                      hint={`Jusqu'à ${MAX_IMAGES} images, la première sera principale`}
                    />
                    <VehicleGallery
                      images={editing.vehicle_images ?? []}
                      pendingImages={pendingImages}
                      isUploading={uploadImagesMut.isPending}
                      onUpload={handleUploadImages}
                      onDelete={handleDeleteImage}
                      onDeletePending={(index) =>
                        setPendingImages((prev) => prev.filter((_, i) => i !== index))
                      }
                    />
                  </section>

                  {/* Section 5 */}
                  <section className="space-y-4">
                    <SectionTitle
                      icon={TagIcon}
                      title="Options disponibles"
                      hint="Équipements additionnels payants"
                      action={
                        <Button size="sm" variant="outline" onClick={addOption}>
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      }
                    />

                    {optionInputs.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                        Aucune option. Cliquez sur « Ajouter » pour en créer.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {optionInputs.map((opt, i) => (
                          <div
                            key={opt.id || `new-${i}`}
                            className="flex items-end gap-2 rounded-xl border border-border bg-card p-2.5"
                          >
                            <div className="flex-1">
                              <Label className="text-[11px]">Libellé</Label>
                              <Input
                                className="mt-1"
                                value={opt.label}
                                onChange={(e) => updateOption(i, "label", e.target.value)}
                                placeholder="Ex: Pack cuir"
                              />
                            </div>
                            <div className="w-28 sm:w-32">
                              <Label className="text-[11px]">Prix</Label>
                              <Input
                                className="mt-1"
                                type="number"
                                value={opt.price}
                                onChange={(e) => updateOption(i, "price", Number(e.target.value))}
                                placeholder="0"
                              />
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Supprimer"
                              onClick={() => removeOption(i)}
                              className="shrink-0 text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {editing.id > 0 && optionInputs.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={syncOptions}
                        disabled={syncOptionsMut.isPending}
                      >
                        {syncOptionsMut.isPending ? "Synchronisation…" : "Synchroniser les options"}
                      </Button>
                    )}
                  </section>

                  {/* Section 6 */}
                  <section className="flex items-center justify-between gap-3 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Mettre en vedette</p>
                        <p className="text-xs text-muted-foreground">
                          Afficher sur la page d'accueil
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={editing.featured}
                      onCheckedChange={(c) => setEditing({ ...editing, featured: c })}
                    />
                  </section>
                </div>
              </div>

              <SheetFooter className="border-t border-border/60 bg-background/95 px-5 py-3.5 backdrop-blur-sm sm:flex-row sm:justify-end sm:px-6">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setEditing(null);
                    setPendingImages([]);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="accent"
                  className="w-full shadow-lg shadow-accent/20 sm:w-auto"
                  onClick={onSave}
                >
                  {editing.id > 0 ? "Enregistrer les modifications" : "Créer le véhicule"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ============ MODAL SUPPRESSION ============ */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 sm:mx-0">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <AlertDialogTitle className="font-display text-lg font-extrabold tracking-tight sm:text-left">
              Supprimer ce véhicule ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-left">
              Cette action est <strong className="text-destructive">irréversible</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {toDelete && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3">
              <img
                src={coverOf(toDelete)}
                alt={`${toDelete.brand} ${toDelete.model}`}
                className="h-14 w-20 shrink-0 rounded-lg border border-border object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {toDelete.brand} {toDelete.model}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {toDelete.year} · {toDelete.category} · {fcfa(toDelete.price_fcfa)}
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="w-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90 sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
