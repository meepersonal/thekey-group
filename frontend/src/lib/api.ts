const API_BASE = "https://api-key-group.geant.app/api/v1";

/** Origine seule (sans /api/v1), utile pour résoudre les URLs /storage renvoyées par l'API. */
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

type LoginResponse = {
  token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
  };
};

export type VehicleImage = {
  id: number;
  vehicle_id: number;
  url: string;
  uploaded_at: string | null;
};

export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  brand_id: number | null;
  model: string;
  category: string;
  category_id: number | null;
  condition: string;
  year: number;
  mileage_km: number;
  energy: string;
  transmission: string;
  nombre_places: number;
  engine: string;
  consumption: string;
  price_fcfa: number;
  badge: string | null;
  status: string;
  featured: boolean;
  highlights: string[];
  description: string | null;
  vehicle_images: VehicleImage[];
  options: VehicleOption[];
  created_at: string | null;
  updated_at: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  origin: string | null;
  description: string | null;
  is_active: boolean;
  vehicles_count: number;
  created_at: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  vehicles_count: number;
  created_at: string | null;
};

export type Preorder = {
  id: number;
  reference: string;
  appointment_code: string | null;
  vehicle: { id: number; brand: string; model: string; slug: string } | null;
  client_name: string;
  full_name: string | null;
  phone: string;
  dial: string;
  email: string;
  city: string | null;
  country: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  notes: string | null;
  base_price: number;
  options: { label: string; price: number }[];
  total: number;
  status: string;
  container_code: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ContainerEvent = {
  id: number;
  container_code: string;
  stage: number;
  stage_label: string;
  event_date: string | null;
  location: string | null;
  comments: string | null;
  created_by: number | null;
  author_name: string | null;
  created_at: string | null;
};

export type Container = {
  id: number;
  code: string;
  vessel: string | null;
  carrier: string | null;
  port_depart: string | null;
  port_arrivee: string | null;
  departure_date: string | null;
  eta: string | null;
  stage: number;
  stage_label: string;
  client: string | null;
  note: string | null;
  preorders_count: number;
  events_count: number;
  latest_event: ContainerEvent | null;
  events?: ContainerEvent[];
  created_at: string | null;
  updated_at: string | null;
};

export type VehicleOption = {
  id: number;
  vehicle_id?: number;
  label: string;
  price: number;
  option_key: string | null;
};

export type Agence = {
  id: string;
  name: string;
  location: string;
  map_url: string | null;
  phone: string | null;
  hours: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type MediaUploadResponse = {
  data: {
    url: string;
    path: string;
  };
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  role: string;
  is_blocked: boolean;
  blocked_at: string | null;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StatsTotals = {
  views: number;
  visitors: number;
  clicks: number;
  total_duration_seconds?: number;
  avg_duration_seconds: number;
  clicks_per_view: number;
  views_previous_period?: number;
  views_change_pct: number | null;
};

export type StatsTimelinePoint = {
  month?: string;
  period?: string;
  label?: string;
  full_label?: string;
  day?: string;
  views: number;
  visitors?: number;
  avg_duration_seconds?: number;
  clicks?: number;
};

export type StatsRange = {
  from: string;
  to: string;
  days: number;
  granularity: "day" | "month";
};

export type TopPageStat = {
  vehicle_id: number;
  path: string;
  label: string;
  views: number;
  clicks: number;
  avg_duration_seconds: number;
};

export type ReferrerStat = { host: string; views: number };

export type OverviewStats = {
  totals: StatsTotals;
  timeline: StatsTimelinePoint[];
  range?: StatsRange;
  top_pages: TopPageStat[];
};

export type VehicleStats = {
  vehicle: { id: number; label: string };
  totals: Omit<
    StatsTotals,
    "total_duration_seconds" | "views_previous_period" | "views_change_pct"
  >;
  timeline: StatsTimelinePoint[];
  referrers: ReferrerStat[];
};

export type TrackingResult = {
  lookup: "reference" | "appointment_code" | "container_code";
  preorder: {
    reference: string;
    appointment_code: string | null;
    status: string;
    created_at: string | null;
  } | null;
  vehicle: {
    id: number;
    brand: string;
    model: string;
    slug: string;
    year: number;
    mileage_km: number;
    nombre_places: number;
    condition: string;
    energy: string | null;
    transmission: string | null;
    image: string | null;
  } | null;
  container: {
    code: string;
    vessel: string | null;
    carrier: string | null;
    port_depart: string | null;
    port_arrivee: string | null;
    departure_date: string | null;
    eta: string | null;
    stage: number;
    stage_label: string;
  } | null;
  events: {
    stage: number;
    stage_label: string;
    event_date: string | null;
    location: string | null;
    comments: string | null;
  }[];
};

export type DashboardMonthPoint = {
  month: string;
  period: string;
  orders: number;
  revenue: number;
};

export type DashboardStats = {
  vehicles: {
    total: number;
    in_stock: number;
    on_order: number;
    hidden: number;
    change_pct: number | null;
  };
  preorders: {
    total: number;
    active: number;
    new: number;
    cancelled: number;
    change_pct: number | null;
  };
  revenue: {
    total: number;
    month: number;
    previous_month: number;
    change_pct: number | null;
  };
  containers: {
    total: number;
    in_transit: number;
    stage_counts: Record<string, number>;
  };
  by_brand: { name: string; value: number }[];
  by_status: { status: string; value: number }[];
  by_month: DashboardMonthPoint[];
};

export type SiteSettings = {
  site_name?: string | null;
  site_about?: string | null;
  site_logo?: string | null;
  site_favicon?: string | null;
  email_contact?: string | null;
  support_phone?: string | null;
  whatsapp_number?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  linkedin_url?: string | null;
  phones?: { label: string; value: string }[];
  addresses?: { label: string; value: string }[];
  socials?: { platform: string; url: string }[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("admin_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/* ════════════════════ Auth expiry handling ════════════════════ */
type UnauthenticatedHandler = () => void;
let unauthenticatedHandler: UnauthenticatedHandler | null = null;

export const onUnauthenticated = (handler: UnauthenticatedHandler | null) => {
  unauthenticatedHandler = handler;
};

export function handleUnauthenticated() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  if (unauthenticatedHandler) {
    unauthenticatedHandler();
  } else {
    window.location.assign("/admin/login");
  }
}

function isAuthError(response: Response, message: string) {
  return response.status === 401 || message === "Unauthenticated.";
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers as Record<string, string>) },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Une erreur est survenue." }));
    const message = (error as { message?: string }).message || "Une erreur est survenue.";

    if (isAuthError(response, message)) {
      handleUnauthenticated();
      throw new Error("Session expirée, reconnectez-vous.");
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  const result: T = await response.json();
  return result;
}

export const api = {
  login: (
    email: string,
    password: string,
  ): Promise<{ token: string; user: LoginResponse["user"] }> =>
    apiRequest<LoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((r) => ({ token: r.token, user: r.user })),

  logout: (): Promise<void> => apiRequest("/admin/logout", { method: "POST" }),

  getVehicles: (params?: Record<string, string>): Promise<PaginatedResponse<Vehicle>> => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`/admin/vehicles?${qs}`);
  },

  /* Public (sans authentification) */
  getPublicVehicles: (params?: Record<string, string>): Promise<PaginatedResponse<Vehicle>> => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`/vehicles${qs ? `?${qs}` : ""}`);
  },

  getPublicVehicle: (id: number | string): Promise<{ data: Vehicle }> =>
    apiRequest(`/vehicles/${id}`),

  /** Agences actives, triées par ordre d'affichage (table `agences`). */
  getPublicAgences: (): Promise<{ data: Agence[] }> => apiRequest("/agences"),

  getPublicAgence: (id: string): Promise<{ data: Agence }> => apiRequest(`/agences/${id}`),

  getFeaturedVehicles: (perPage = 6): Promise<PaginatedResponse<Vehicle>> =>
    apiRequest(`/vehicles?featured=1&per_page=${perPage}`),

  getVehicle: (id: number | string): Promise<{ data: Vehicle }> =>
    apiRequest(`/admin/vehicles/${id}`),

  createVehicle: (data: Partial<Vehicle>): Promise<{ data: Vehicle }> =>
    apiRequest("/admin/vehicles", { method: "POST", body: JSON.stringify(data) }),

  updateVehicle: (id: number | string, data: Partial<Vehicle>): Promise<{ data: Vehicle }> =>
    apiRequest(`/admin/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteVehicle: (id: number | string): Promise<void> =>
    apiRequest(`/admin/vehicles/${id}`, { method: "DELETE" }),

  getVehicleStatuses: (): Promise<{ data: string[] }> => apiRequest("/admin/vehicles/statuses"),

  getVehicleEnergyTypes: (): Promise<{ data: string[] }> =>
    apiRequest("/admin/vehicles/energy-types"),

  getVehicleTransmissionTypes: (): Promise<{ data: string[] }> =>
    apiRequest("/admin/vehicles/transmission-types"),

  syncVehicleOptions: (
    vehicleId: number | string,
    options: { label: string; price: number; option_key?: string | null }[],
  ): Promise<{ data: VehicleOption[] }> =>
    apiRequest(`/admin/vehicles/${vehicleId}/options`, {
      method: "POST",
      body: JSON.stringify({ options }),
    }),

  destroyVehicleOption: (vehicleId: number | string, optionId: number | string): Promise<void> =>
    apiRequest(`/admin/vehicles/${vehicleId}/options/${optionId}`, { method: "DELETE" }),

  uploadVehicleImages: async (
    vehicleId: number | string,
    files: File[],
  ): Promise<{ data: VehicleImage[]; total: number }> => {
    const token = localStorage.getItem("admin_token");
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const form = new FormData();
    files.forEach((f) => form.append("images[]", f));

    const response = await fetch(`${API_BASE}/admin/vehicles/${vehicleId}/images`, {
      method: "POST",
      headers,
      body: form,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Une erreur est survenue." }));
      throw new Error((error as { message?: string }).message || "Une erreur est survenue.");
    }

    return response.json();
  },

  deleteVehicleImage: (
    vehicleId: number | string,
    imageId: number | string,
  ): Promise<{ data: VehicleImage[]; total: number }> =>
    apiRequest(`/admin/vehicles/${vehicleId}/images/${imageId}`, { method: "DELETE" }),

  getBrands: (active?: boolean): Promise<{ data: Brand[] }> => {
    const qs = active !== undefined ? `?active=${active}` : "";
    return apiRequest(`/brands?${qs}`);
  },

  getAdminBrands: (): Promise<{ data: Brand[] }> => apiRequest("/admin/brands"),

  createBrand: (data: Partial<Brand>): Promise<{ data: Brand }> =>
    apiRequest("/admin/brands", { method: "POST", body: JSON.stringify(data) }),

  updateBrand: (id: number | string, data: Partial<Brand>): Promise<{ data: Brand }> =>
    apiRequest(`/admin/brands/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteBrand: (id: number | string): Promise<void> =>
    apiRequest(`/admin/brands/${id}`, { method: "DELETE" }),

  getCategories: (active?: boolean): Promise<{ data: Category[] }> => {
    const qs = active !== undefined ? `?active=${active}` : "";
    return apiRequest(`/categories?${qs}`);
  },

  getAdminCategories: (): Promise<{ data: Category[] }> => apiRequest("/admin/categories"),

  createCategory: (data: Partial<Category>): Promise<{ data: Category }> =>
    apiRequest("/admin/categories", { method: "POST", body: JSON.stringify(data) }),

  updateCategory: (id: number | string, data: Partial<Category>): Promise<{ data: Category }> =>
    apiRequest(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteCategory: (id: number | string): Promise<void> =>
    apiRequest(`/admin/categories/${id}`, { method: "DELETE" }),

  /* Agences */
  getAgences: (active?: boolean): Promise<{ data: Agence[] }> => {
    const qs = active !== undefined ? `?active=${active}` : "";
    return apiRequest(`/admin/agences${qs ? `?${qs}` : ""}`);
  },

  getAgence: (id: number | string): Promise<{ data: Agence }> => apiRequest(`/admin/agences/${id}`),

  createAgence: (data: Partial<Agence>): Promise<{ data: Agence }> =>
    apiRequest("/admin/agences", { method: "POST", body: JSON.stringify(data) }),

  updateAgence: (id: number | string, data: Partial<Agence>): Promise<{ data: Agence }> =>
    apiRequest(`/admin/agences/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteAgence: (id: number | string): Promise<void> =>
    apiRequest(`/admin/agences/${id}`, { method: "DELETE" }),

  getPreorders: (params?: Record<string, string>): Promise<PaginatedResponse<Preorder>> => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`/admin/preorders?${qs}`);
  },

  createPreorder: (data: {
    vehicle_id: number | string;
    name: string;
    full_name?: string;
    phone: string;
    dial?: string;
    email?: string;
    city?: string;
    country?: string;
    appointment_date?: string;
    appointment_time?: string;
    notes?: string;
    options?: { label: string; price: number }[];
  }): Promise<{ data: Preorder }> =>
    apiRequest("/preorders", { method: "POST", body: JSON.stringify(data) }),

  updatePreorder: (id: number | string, data: Partial<Preorder>): Promise<{ data: Preorder }> =>
    apiRequest(`/admin/preorders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deletePreorder: (id: number | string): Promise<void> =>
    apiRequest(`/admin/preorders/${id}`, { method: "DELETE" }),

  getContainers: (
    params?: Record<string, string>,
  ): Promise<PaginatedResponse<Container> & { stage_counts: Record<string, number> }> => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`/admin/containers?${qs}`);
  },

  createContainer: (data: {
    code: string;
    vessel?: string | null;
    carrier?: string | null;
    port_depart?: string | null;
    port_arrivee?: string | null;
    departure_date?: string | null;
    eta?: string | null;
    stage?: number;
    note?: string | null;
    initial_event?: {
      event_date?: string | null;
      location?: string | null;
      comments?: string | null;
    } | null;
    preorder_ids?: number[];
  }): Promise<{ data: Container }> =>
    apiRequest("/admin/containers", { method: "POST", body: JSON.stringify(data) }),

  updateContainer: (code: string, data: Partial<Container>): Promise<{ data: Container }> =>
    apiRequest(`/admin/containers/${code}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteContainer: (code: string): Promise<void> =>
    apiRequest(`/admin/containers/${code}`, { method: "DELETE" }),

  getContainer: (code: string): Promise<{ data: Container }> =>
    apiRequest(`/admin/containers/${encodeURIComponent(code)}`),

  getContainerEvents: (code: string): Promise<{ data: ContainerEvent[] }> =>
    apiRequest(`/admin/containers/${encodeURIComponent(code)}/events`),

  addContainerEvent: (
    code: string,
    data: {
      stage: number;
      event_date: string;
      location?: string | null;
      comments?: string | null;
      update_stage?: boolean;
    },
  ): Promise<{ data: ContainerEvent; container: Container }> =>
    apiRequest(`/admin/containers/${encodeURIComponent(code)}/events`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteContainerEvent: (code: string, eventId: number | string): Promise<void> =>
    apiRequest(`/admin/containers/${encodeURIComponent(code)}/events/${eventId}`, {
      method: "DELETE",
    }),

  uploadMedia: async (file: File, type?: "logo" | "favicon"): Promise<MediaUploadResponse> => {
    const token = localStorage.getItem("admin_token");
    // Pas de Content-Type : le navigateur doit ajouter la boundary du multipart.
    const headers: HeadersInit = { Accept: "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const form = new FormData();
    form.append("file", file);
    if (type) {
      form.append("type", type);
    }

    const response = await fetch(`${API_BASE}/admin/media/upload`, {
      method: "POST",
      headers,
      body: form,
      credentials: "include",
    });

    if (!response.ok) {
      const payload = await response
        .json()
        .catch(() => ({}) as { message?: string; errors?: Record<string, string[]> });

      if (response.status === 401) {
        handleUnauthenticated();
        throw new Error("Session expirée, reconnectez-vous.");
      }

      const fieldError = payload.errors?.["file"]?.[0];
      throw new Error(fieldError || payload.message || "Une erreur est survenue.");
    }

    return response.json();
  },

  /* Utilisateurs (admin) */
  getUsers: (params?: Record<string, string>): Promise<PaginatedResponse<AdminUser>> => {
    const qs = params ? new URLSearchParams(params).toString() : "";
    return apiRequest(`/admin/users${qs ? `?${qs}` : ""}`);
  },

  getUserRoles: (): Promise<{ data: string[] }> => apiRequest("/admin/users/roles"),

  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    send_credentials?: boolean;
  }): Promise<{ data: AdminUser; credentials_sent?: boolean }> =>
    apiRequest("/admin/users", { method: "POST", body: JSON.stringify(data) }),

  updateUser: (
    id: number | string,
    data: { name?: string; email?: string; password?: string; role?: string },
  ): Promise<{ data: AdminUser }> =>
    apiRequest(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  toggleUserBlock: (id: number | string): Promise<{ data: AdminUser }> =>
    apiRequest(`/admin/users/${id}/toggle-block`, { method: "PATCH" }),

  deleteUser: (id: number | string): Promise<void> =>
    apiRequest(`/admin/users/${id}`, { method: "DELETE" }),

  /* Statistiques pages véhicules */
  getStatsOverview: (params: {
    months?: number;
    from?: string;
    to?: string;
    granularity?: "day" | "month";
  }): Promise<{ data: OverviewStats }> => {
    const qs = new URLSearchParams();
    if (params.months !== undefined) qs.set("months", String(params.months));
    if (params.from) qs.set("from", params.from);
    if (params.to) qs.set("to", params.to);
    if (params.granularity) qs.set("granularity", params.granularity);
    return apiRequest(`/admin/stats/overview?${qs.toString()}`);
  },

  getDashboardStats: (months = 6): Promise<{ data: DashboardStats }> =>
    apiRequest(`/admin/stats/dashboard?months=${months}`),

  getTracking: (code: string): Promise<{ data: TrackingResult }> =>
    apiRequest(`/track?code=${encodeURIComponent(code)}`),

  getVehicleStats: (id: number | string, days = 30): Promise<{ data: VehicleStats }> =>
    apiRequest(`/admin/stats/vehicles/${id}?days=${days}`),

  getSettings: (): Promise<{ data: Record<string, unknown> }> => apiRequest("/admin/settings"),

  getPublicSettings: (): Promise<{ data: SiteSettings }> => apiRequest("/settings"),
  updateSettings: (data: Partial<SiteSettings>): Promise<{ data: Partial<SiteSettings> }> =>
    apiRequest("/admin/settings", { method: "PATCH", body: JSON.stringify(data) }),
};
