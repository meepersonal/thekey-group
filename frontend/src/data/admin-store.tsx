import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  api,
  type Vehicle,
  type Preorder,
  type Container,
  type Brand,
  type Category,
  type Agence,
} from "@/lib/api";
import { toast } from "sonner";

import type {
  Vehicle as ApiVehicle,
  Preorder as ApiPreorder,
  VehicleOption as ApiVehicleOption,
} from "@/lib/api";

export type AdminVehicleStatus = ApiVehicle["status"];
export type OrderStatus = ApiPreorder["status"];

export type {
  Vehicle,
  Preorder,
  Container,
  Brand,
  Category,
  Agence,
  VehicleImage,
  VehicleOption,
  SiteSettings,
} from "@/lib/api";

export const CONTAINER_STAGES = [
  "Commande effectuée depuis la Chine",
  "Démarrage du bateau depuis la Chine",
  "En transit maritime",
  "Arrivé au port",
  "Dédouanement en cours",
  "Dédouané",
  "En livraison",
];

export const fcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

export const orderTotal = (o: Preorder) =>
  (o.base_price ?? 0) + (o.options?.reduce((s, x) => s + (x.price ?? 0), 0) ?? 0);

export function useVehicles(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => api.getVehicles(params),
    staleTime: 30_000,
  });
}

export function useVehicle(id: number | string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => api.getVehicle(id).then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => api.getBrands(true).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(true).then((r) => r.data),
    staleTime: 60_000,
  });
}

/* ═══════════════════════════════════════════════
 * Marques (admin)
 * ═══════════════════════════════════════════════ */
export function useAdminBrands() {
  return useQuery({
    queryKey: ["admin-brands"],
    queryFn: () => api.getAdminBrands().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createBrand,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Marque ajoutée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Brand> }) =>
      api.updateBrand(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Marque mise à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteBrand,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-brands"] });
      toast.success("Marque supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ═══════════════════════════════════════════════
 * Catégories (admin)
 * ═══════════════════════════════════════════════ */
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.getAdminCategories().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Catégorie ajoutée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Category> }) =>
      api.updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Catégorie mise à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Catégorie supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ═══════════════════════════════════════════════
 * Agences (admin)
 * ═══════════════════════════════════════════════ */
export function useAgences() {
  return useQuery({
    queryKey: ["agences"],
    queryFn: () => api.getAgences().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useCreateAgence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createAgence,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agences"] });
      toast.success("Agence ajoutée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateAgence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Agence> }) =>
      api.updateAgence(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agences"] });
      toast.success("Agence mise à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteAgence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAgence,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agences"] });
      toast.success("Agence supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function usePreorders(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["preorders", params],
    queryFn: () => api.getPreorders(params),
    staleTime: 30_000,
  });
}

export function useCreatePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createPreorder>[0]) => api.createPreorder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["preorders"] });
      toast.success("Précommande enregistrée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useContainers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["containers", params],
    queryFn: () => api.getContainers(params),
    staleTime: 30_000,
  });
}

export function useContainer(code: string | null) {
  return useQuery({
    queryKey: ["container", code],
    queryFn: () => api.getContainer(code as string).then((r) => r.data),
    enabled: Boolean(code),
    staleTime: 15_000,
  });
}

export function useAddContainerEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      code,
      data,
    }: {
      code: string;
      data: {
        stage: number;
        event_date: string;
        location?: string | null;
        comments?: string | null;
        update_stage?: boolean;
      };
    }) => api.addContainerEvent(code, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["containers"] });
      qc.invalidateQueries({ queryKey: ["container"] });
      toast.success("Étape ajoutée au suivi.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteContainerEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, eventId }: { code: string; eventId: number | string }) =>
      api.deleteContainerEvent(code, eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["containers"] });
      qc.invalidateQueries({ queryKey: ["container"] });
      toast.success("Étape supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule ajouté.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Vehicle> }) =>
      api.updateVehicle(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule mis à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteVehicle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Véhicule supprimé.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useVehicleStatuses() {
  return useQuery({
    queryKey: ["vehicle-statuses"],
    queryFn: () => api.getVehicleStatuses().then((r) => r.data),
    staleTime: 300_000,
  });
}

export function useVehicleEnergyTypes() {
  return useQuery({
    queryKey: ["vehicle-energy-types"],
    queryFn: () => api.getVehicleEnergyTypes().then((r) => r.data),
    staleTime: 300_000,
  });
}

export function useVehicleTransmissionTypes() {
  return useQuery({
    queryKey: ["vehicle-transmission-types"],
    queryFn: () => api.getVehicleTransmissionTypes().then((r) => r.data),
    staleTime: 300_000,
  });
}

/* ═══════════════════════════════════════════════
 * Utilisateurs (admin)
 * ═══════════════════════════════════════════════ */
const USERS_KEY = "admin-users";

function invalidateUsers(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: [USERS_KEY] });
}

export function useUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: [USERS_KEY, params],
    queryFn: () => api.getUsers(params),
    staleTime: 30_000,
  });
}

export function useUserRoles() {
  return useQuery({
    queryKey: [USERS_KEY, "roles"],
    queryFn: () => api.getUserRoles().then((r) => r.data),
    staleTime: 600_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createUser>[0]) => api.createUser(data),
    onSuccess: (response) => {
      invalidateUsers(qc);
      toast.success(
        response.credentials_sent
          ? "Utilisateur créé. Identifiants envoyés par e-mail."
          : "Utilisateur créé.",
      );
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: { name?: string; email?: string; password?: string; role?: string };
    }) => api.updateUser(id, data),
    onSuccess: () => {
      invalidateUsers(qc);
      toast.success("Utilisateur mis à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useToggleUserBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.toggleUserBlock(id),
    onSuccess: (res) => {
      invalidateUsers(qc);
      toast.success(res.data.is_blocked ? "Compte bloqué." : "Compte réactivé.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => api.deleteUser(id),
    onSuccess: () => {
      invalidateUsers(qc);
      toast.success("Utilisateur supprimé.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ═══════════════════════════════════════════════
 * Statistiques pages véhicules (admin)
 * ═══════════════════════════════════════════════ */
export type StatsOverviewParams = {
  months?: number;
  from?: string;
  to?: string;
  granularity?: "day" | "month";
};

export function useStatsOverview(params: StatsOverviewParams | number = 6) {
  const normalized: StatsOverviewParams = typeof params === "number" ? { months: params } : params;

  return useQuery({
    queryKey: ["stats-overview", normalized],
    queryFn: () => api.getStatsOverview(normalized).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useDashboardStats(months = 6) {
  return useQuery({
    queryKey: ["stats-dashboard", months],
    queryFn: () => api.getDashboardStats(months).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useVehicleStats(id: number | string | undefined, days = 30) {
  return useQuery({
    queryKey: ["stats-vehicle", id, days],
    queryFn: () => api.getVehicleStats(id as string, days).then((r) => r.data),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

/* ═══════════════════════════════════════════════
 * Options de véhicule (admin)
 * ═══════════════════════════════════════════════ */
export function useSyncVehicleOptions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      options,
    }: {
      vehicleId: number | string;
      options: ApiVehicleOption[];
    }) => api.syncVehicleOptions(vehicleId, options),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Options mises à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVehicleOption() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      optionId,
    }: {
      vehicleId: number | string;
      optionId: number | string;
    }) => api.destroyVehicleOption(vehicleId, optionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Option supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ═══════════════════════════════════════════════
 * Images de véhicule (admin)
 * ═══════════════════════════════════════════════ */
export function useUploadVehicleImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, files }: { vehicleId: number | string; files: File[] }) =>
      api.uploadVehicleImages(vehicleId, files),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success(`${data.data.length} image(s) téléchargée(s).`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVehicleImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      imageId,
    }: {
      vehicleId: number | string;
      imageId: number | string;
    }) => api.deleteVehicleImage(vehicleId, imageId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Image supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Preorder> }) =>
      api.updatePreorder(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["preorders"] });
      toast.success("Précommande mise à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePreorder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deletePreorder,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["preorders"] });
      toast.success("Précommande supprimée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useCreateContainer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createContainer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Conteneur ajouté.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateContainer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: Partial<Container> }) =>
      api.updateContainer(code, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Conteneur mis à jour.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteContainer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteContainer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["containers"] });
      toast.success("Conteneur supprimé.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

/* ═══════════════════════════════════════════════
 * Médias (upload logo / favicon)
 * ═══════════════════════════════════════════════ */
export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => api.getSettings().then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configuration enregistrée.");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUploadImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type?: "logo" | "favicon" }) =>
      api.uploadMedia(file, type),
    onSuccess: (res, { type }) => {
      // L'upload écrit site_logo / site_favicon côté API : on invalide les caches
      // pour que l'aperçu, l'en-tête et l'onglet du navigateur soient à jour.
      qc.invalidateQueries({ queryKey: ["settings"] });
      qc.invalidateQueries({ queryKey: ["public-settings"] });
      toast.success(type === "favicon" ? "Favicon mis à jour." : "Logo mis à jour.", {
        description: res.data.path,
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export const ORDERS_BY_MONTH = [
  { month: "Avr", precommandes: 6 },
  { month: "Mai", precommandes: 9 },
  { month: "Juin", precommandes: 11 },
  { month: "Juil", precommandes: 14 },
  { month: "Août", precommandes: 16 },
  { month: "Sept", precommandes: 18 },
];

export const ADMIN_NOTIFICATIONS = [
  { id: 1, text: "Nouvelle précommande RES-2026-004 (GAC Emkoo)", time: "il y a 12 min" },
  { id: 2, text: "CONT-2026-JET99 arrivé au Port de Cotonou", time: "il y a 2 h" },
  { id: 3, text: "Acompte reçu — Koffi MENSAH", time: "hier" },
];
