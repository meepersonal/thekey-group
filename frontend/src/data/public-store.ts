import { useEffect } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useFeaturedVehicles(perPage = 6) {
  return useQuery({
    queryKey: ["public-vehicles", "featured", perPage],
    queryFn: () => api.getFeaturedVehicles(perPage).then((r) => r.data),
    staleTime: 300_000,
  });
}

export function usePublicVehicles(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["public-vehicles", "list", params],
    queryFn: () => api.getPublicVehicles(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function usePublicVehiclesPage(params?: Record<string, string>) {
  return useQuery({
    queryKey: ["public-vehicles", "page", params],
    queryFn: () => api.getPublicVehicles(params),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function usePublicBrands() {
  return useQuery({
    queryKey: ["public-brands"],
    queryFn: () => api.getBrands(true).then((r) => r.data),
    staleTime: 300_000,
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: () => api.getCategories(true).then((r) => r.data),
    staleTime: 300_000,
  });
}

export function usePublicVehicle(id: number | string | undefined) {
  return useQuery({
    queryKey: ["public-vehicles", "detail", id],
    queryFn: () => api.getPublicVehicle(id as string).then((r) => r.data),
    enabled: Boolean(id),
    staleTime: 60_000,
    retry: false,
  });
}

export function useTracking(code: string | undefined) {
  return useQuery({
    queryKey: ["public-tracking", code],
    queryFn: () => api.getTracking(code as string).then((r) => r.data),
    enabled: Boolean(code && code.trim()),
    staleTime: 30_000,
    retry: false,
  });
}

export function usePublicAgences() {
  return useQuery({
    queryKey: ["public-agences"],
    queryFn: () => api.getPublicAgences().then((r) => r.data),
    staleTime: 300_000,
  });
}

export function usePublicSettings() {
  return useQuery({
    queryKey: ["public-settings"],
    queryFn: () => api.getPublicSettings().then((r) => r.data),
    staleTime: 300_000,
  });
}

/**
 * Applique au document les réglages publics : favicon de l'onglet et nom du site.
 * Sans cela, un favicon téléversé depuis /admin/parametres n'aurait aucun effet,
 * index.html ne pouvant pas connaître la valeur stockée en base.
 */
export function useDocumentBranding() {
  const { data } = usePublicSettings();

  const favicon = data?.site_favicon ?? null;
  const siteName = data?.site_name ?? null;

  useEffect(() => {
    if (!favicon) return;

    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/x-icon";
    link.href = favicon;
  }, [favicon]);

  useEffect(() => {
    if (siteName && window.location.pathname !== "/") document.title = siteName;
  }, [siteName]);
}
