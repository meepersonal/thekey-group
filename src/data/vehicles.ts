import suvWhite from "@/assets/car-suv-white.jpg";
import sedanBlue from "@/assets/car-sedan-blue.jpg";
import pickupGrey from "@/assets/car-pickup-grey.jpg";

export type Category = "SUV" | "Berline" | "Utilitaire" | "Électrique" | "Hybride" | "Pick-up";
export type Condition = "Neuf" | "Occasion certifiée";

export type VehicleOption = {
  id: string;
  label: string;
  price: number; // FCFA
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  category: Category;
  condition: Condition;
  year: number;
  mileageKm: number;
  energy: string;
  transmission: string;
  seats: number;
  engine: string;
  battery?: string;
  consumption: string;
  priceFcfa: number;
  priceUsd: number;
  badge?: string;
  images: string[];
  highlights: string[];
};

export const USD_RATE = 610; // 1 USD ≈ 610 FCFA (indicatif)

export const OPTIONS: VehicleOption[] = [
  { id: "vitres", label: "Teinte de vitres", price: 150000 },
  { id: "cam360", label: "Caméra 360°", price: 450000 },
  { id: "barres", label: "Barres de toit", price: 120000 },
  { id: "chargeur", label: "Chargeur rapide 7 kW", price: 850000 },
  { id: "protection", label: "Kit de protection de sol", price: 95000 },
  { id: "jantes", label: "Jantes alliage 19″", price: 620000 },
  { id: "assurance", label: "Assurance transport premium", price: 300000 },
];

export const VEHICLES: Vehicle[] = [
  {
    id: "byd-song-plus",
    brand: "BYD",
    model: "Song Plus EV",
    category: "Électrique",
    condition: "Neuf",
    year: 2026,
    mileageKm: 0,
    energy: "100% Électrique",
    transmission: "Automatique",
    seats: 5,
    engine: "Moteur électrique 150 kW",
    battery: "Blade Battery 71,8 kWh — 505 km",
    consumption: "15,4 kWh / 100 km",
    priceFcfa: 18500000,
    priceUsd: Math.round(18500000 / USD_RATE),
    badge: "Électrique",
    images: [suvWhite, sedanBlue, pickupGrey],
    highlights: ["Autonomie 505 km", "Charge rapide 80% en 35 min", "Toit panoramique"],
  },
  {
    id: "changan-uni-k",
    brand: "CHANGAN",
    model: "UNI-K",
    category: "SUV",
    condition: "Neuf",
    year: 2026,
    mileageKm: 0,
    energy: "Essence turbo",
    transmission: "Automatique 8 rapports",
    seats: 5,
    engine: "2.0 T GDI — 233 ch",
    consumption: "8,9 L / 100 km",
    priceFcfa: 21900000,
    priceUsd: Math.round(21900000 / USD_RATE),
    badge: "Disponible sur commande",
    images: [suvWhite, pickupGrey, sedanBlue],
    highlights: ["4 roues motrices", "Sièges cuir ventilés", "Écran 12,3″"],
  },
  {
    id: "jetour-dashing",
    brand: "JETOUR",
    model: "Dashing",
    category: "SUV",
    condition: "Neuf",
    year: 2025,
    mileageKm: 0,
    energy: "Essence",
    transmission: "Automatique 7 DCT",
    seats: 5,
    engine: "1.6 T — 197 ch",
    consumption: "7,4 L / 100 km",
    priceFcfa: 15400000,
    priceUsd: Math.round(15400000 / USD_RATE),
    badge: "Best-seller",
    images: [suvWhite, sedanBlue],
    highlights: ["Design sport", "Caméra de recul", "Apple CarPlay"],
  },
  {
    id: "gac-empow",
    brand: "GAC",
    model: "Empow GS",
    category: "Berline",
    condition: "Neuf",
    year: 2026,
    mileageKm: 0,
    energy: "Essence",
    transmission: "Automatique",
    seats: 5,
    engine: "1.5 T — 177 ch",
    consumption: "6,8 L / 100 km",
    priceFcfa: 12800000,
    priceUsd: Math.round(12800000 / USD_RATE),
    images: [sedanBlue, suvWhite],
    highlights: ["Mode sport", "Sono 8 haut-parleurs", "Régulateur adaptatif"],
  },
  {
    id: "chery-tiggo-8",
    brand: "CHERY",
    model: "Tiggo 8 Pro",
    category: "SUV",
    condition: "Occasion certifiée",
    year: 2024,
    mileageKm: 18500,
    energy: "Essence",
    transmission: "Automatique 7 DCT",
    seats: 7,
    engine: "1.6 T — 197 ch",
    consumption: "7,9 L / 100 km",
    priceFcfa: 13200000,
    priceUsd: Math.round(13200000 / USD_RATE),
    badge: "Inspectée 150 points",
    images: [suvWhite, pickupGrey],
    highlights: ["7 places", "Toit ouvrant", "Historique vérifié"],
  },
  {
    id: "byd-seal",
    brand: "BYD",
    model: "Seal",
    category: "Berline",
    condition: "Neuf",
    year: 2026,
    mileageKm: 0,
    energy: "100% Électrique",
    transmission: "Automatique",
    seats: 5,
    engine: "Moteur électrique 230 kW",
    battery: "Blade Battery 82,5 kWh — 570 km",
    consumption: "16,2 kWh / 100 km",
    priceFcfa: 24500000,
    priceUsd: Math.round(24500000 / USD_RATE),
    badge: "Électrique",
    images: [sedanBlue, suvWhite],
    highlights: ["0-100 km/h en 3,8 s", "Suspension pilotée", "Autonomie 570 km"],
  },
  {
    id: "changan-hunter",
    brand: "CHANGAN",
    model: "Hunter Pick-up",
    category: "Pick-up",
    condition: "Neuf",
    year: 2025,
    mileageKm: 0,
    energy: "Diesel",
    transmission: "Automatique 8 rapports",
    seats: 5,
    engine: "2.0 TD — 190 ch",
    consumption: "8,6 L / 100 km",
    priceFcfa: 17900000,
    priceUsd: Math.round(17900000 / USD_RATE),
    badge: "Robuste",
    images: [pickupGrey, suvWhite],
    highlights: ["Charge utile 1 t", "4x4 enclenchable", "Benne renforcée"],
  },
  {
    id: "gac-m8-van",
    brand: "GAC",
    model: "M8 Utilitaire",
    category: "Utilitaire",
    condition: "Neuf",
    year: 2025,
    mileageKm: 0,
    energy: "Hybride",
    transmission: "Automatique e-CVT",
    seats: 8,
    engine: "2.0 T Hybride — 245 ch",
    consumption: "5,9 L / 100 km",
    priceFcfa: 26900000,
    priceUsd: Math.round(26900000 / USD_RATE),
    badge: "Hybride",
    images: [pickupGrey, sedanBlue],
    highlights: ["8 places modulables", "Portes coulissantes électriques", "Confort VIP"],
  },
  {
    id: "chery-arrizo-hybrid",
    brand: "CHERY",
    model: "Arrizo 8 Hybride",
    category: "Hybride",
    condition: "Occasion certifiée",
    year: 2024,
    mileageKm: 9800,
    energy: "Hybride",
    transmission: "Automatique DHT",
    seats: 5,
    engine: "1.5 T Hybride — 204 ch",
    consumption: "4,7 L / 100 km",
    priceFcfa: 11500000,
    priceUsd: Math.round(11500000 / USD_RATE),
    images: [sedanBlue, pickupGrey],
    highlights: ["Très faible consommation", "Garantie 12 mois", "Faible kilométrage"],
  },
];

export const CATEGORIES: Category[] = [
  "SUV",
  "Berline",
  "Utilitaire",
  "Électrique",
  "Hybride",
  "Pick-up",
];

export const formatFcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

export const formatUsd = (n: number) =>
  "$" + new Intl.NumberFormat("en-US").format(Math.round(n / USD_RATE));

export const getVehicle = (id: string) => VEHICLES.find((v) => v.id === id);
