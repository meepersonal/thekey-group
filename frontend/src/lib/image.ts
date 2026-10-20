import fallbackImage from "@/assets/car-suv-white.jpg";
import { API_ORIGIN } from "@/lib/api";

/**
 * Base des chemins relatifs (`/storage/...`) renvoyés par l'API. `VITE_API_URL`
 * prend le pas ; sinon on retombe sur l'origine du client API, car le front est
 * servi sur un autre domaine et ne peut pas résoudre `/storage` lui-même.
 */
const API_BASE = (import.meta.env["VITE_API_URL"] ?? API_ORIGIN).replace(/\/+$/, "");
const STORAGE_PREFIX = "/public/storage/";

/** URL schématiques : jamais de préfixe à ajouter. */
const ABSOLUTE = /^(https?:)?\/\/|^data:|^blob:/i;

export type VehicleImageLike = { url?: string | null } | null | undefined;

/**
 * Forme minimale d'un véhicule tolérée par les helpers image : accepte aussi bien
 * `vehicle_images[]` renvoyé par l'API que l'ancien champ plat `image`.
 */
export type VehicleLike = {
  vehicle_images?: VehicleImageLike[] | null;
  image?: string | null;
};

/** Image de remplacement affichée quand aucune source n'est exploitable. */
export const IMAGE_FALLBACK = fallbackImage;

/**
 * Normalise une URL d'image venant du backend.
 *
 * Les URL absolues (`http:`, `https:`, `//cdn…`, `data:`, `blob:`) sont renvoyées
 * telles quelles, SAUF si elles contiennent `/storage/` ou `/api/v1/media/` (alors on force
 * `/public/storage/` car le serveur sert les fichiers à cet emplacement).
 * Les chemins relatifs sont préfixés par `VITE_API_URL` afin de
 * rester corrects quand l'API est servie sur un autre hôte que le front.
 * Le backend peut renvoyer `/storage/...`, `storage/...`, `media/...` ou `/api/v1/media/...` — on normalise vers
 * `/public/storage/...` qui est le chemin web accessible.
 * Renvoie `null` pour une source vide, ce qui permet d'afficher le placeholder.
 */
export function resolveImageUrl(url?: string | null): string | null {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) return null;

  // Normalize any URL containing /storage/ or /api/v1/media/ -> /public/storage/
  let normalized = value;
  if (normalized.includes("/storage/")) {
    normalized = normalized.replace(/\/storage\//, "/public/storage/");
  } else if (normalized.includes("/api/v1/media/")) {
    // Backend via_route=true returns /api/v1/media/media/vehicles/xxx.jpg
    // Extract the path after /api/v1/media/ and prefix with /public/storage/
    const mediaPath = normalized.split("/api/v1/media/")[1];
    normalized = `/public/storage/${mediaPath}`;
  } else if (normalized.startsWith("storage/")) {
    normalized = "/public/storage/" + normalized.replace(/^storage\//, "");
  } else if (normalized.startsWith("media/")) {
    normalized = "/public/storage/" + normalized;
  }

  if (ABSOLUTE.test(normalized)) return normalized;
  if (normalized.startsWith("/")) return `${API_BASE}${normalized}`;
  return `${API_BASE}${STORAGE_PREFIX}${normalized.replace(/^\/+/, "")}`;
}

/** `true` si la source produit une URL exploitable. */
export const hasImage = (url?: string | null): boolean => resolveImageUrl(url) !== null;

/**
 * Extrait l'image à l'index demandé d'une collection, en ignorant les entrées
 * vides ou invalides plutôt que de renvoyer un `undefined` cassant le `src`.
 */
export function pickImage(images?: VehicleImageLike[] | null, index = 0): string | null {
  if (!Array.isArray(images)) return null;
  for (let offset = 0; offset < images.length; offset++) {
    const url = resolveImageUrl(images[index + offset]?.url);
    if (url) return url;
  }
  return null;
}

/** Toutes les URL exploitables d'une collection, dans l'ordre. */
export function pickImages(images?: VehicleImageLike[] | null): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((image) => resolveImageUrl(image?.url))
    .filter((url): url is string => url !== null);
}

/** URL de couverture d'un véhicule, quelle que soit la forme des données reçues. */
export function vehicleImageUrl(vehicle?: VehicleLike | null, index = 0): string | null {
  if (!vehicle) return null;
  return (
    pickImage(vehicle.vehicle_images, index) ??
    (index === 0 ? resolveImageUrl(vehicle.image) : null)
  );
}

/** Toutes les images d'un véhicule, pour les galeries. */
export function vehicleImageUrls(vehicle?: VehicleLike | null): string[] {
  if (!vehicle) return [];
  const urls = pickImages(vehicle.vehicle_images);
  const flat = resolveImageUrl(vehicle.image);
  return flat && !urls.includes(flat) ? [flat, ...urls] : urls;
}

/**
 * Construit le lien wa.me à partir du numéro stocké en base
 * (clé `whatsapp_number`). Les espaces, points et « + » sont ignorés :
 * WhatsApp n'attend que les chiffres, préfixés par l'indicatif pays.
 */
export function whatsappLink(number?: string | null): string | null {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}
