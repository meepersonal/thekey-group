export type TrackingStep = {
  label: string;
  description: string;
  date?: string;
};

export type Shipment = {
  code: string;
  container: string;
  vehicle: string;
  client: string;
  vessel: string;
  carrier: string;
  portDepart: string;
  portArrivee: string;
  departureDate: string;
  eta: string;
  currentStep: number; // 0-indexed
};

export const STEPS: TrackingStep[] = [
  {
    label: "Commande confirmée",
    description: "Véhicule acheté et en attente d'embarquement en Chine.",
  },
  {
    label: "Chargement au port (Chine)",
    description: "Véhicule chargé dans le conteneur et scellé au port de départ.",
  },
  { label: "En transit maritime", description: "Navire en route vers le Golfe de Guinée." },
  {
    label: "Arrivée à Cotonou / Dédouanement",
    description: "Débarquement et procédures douanières en cours.",
  },
  { label: "Prêt pour livraison", description: "Véhicule disponible pour retrait ou livraison." },
];

export const SHIPMENTS: Shipment[] = [
  {
    code: "TRACK123",
    container: "MSKU-7743821",
    vehicle: "BYD Song Plus EV — Blanc nacré",
    client: "M. Koffi A.",
    vessel: "MSC ANTONIA",
    carrier: "MSC",
    portDepart: "Shanghai, Chine",
    portArrivee: "Cotonou, Bénin",
    departureDate: "12 août 2026",
    eta: "23 septembre 2026",
    currentStep: 2,
  },
  {
    code: "CONT-2026-X99",
    container: "CMAU-5590114",
    vehicle: "Changan UNI-K — Gris titane",
    client: "Mme Adjovi S.",
    vessel: "CMA CGM BENIN",
    carrier: "CMA CGM",
    portDepart: "Guangzhou, Chine",
    portArrivee: "Cotonou, Bénin",
    departureDate: "2 juillet 2026",
    eta: "10 septembre 2026",
    currentStep: 3,
  },
  {
    code: "AT-2026-0451",
    container: "HLXU-3320987",
    vehicle: "Chery Tiggo 8 Pro — Noir",
    client: "Sté Logibenin",
    vessel: "HAPAG EXPRESS",
    carrier: "Hapag-Lloyd",
    portDepart: "Ningbo, Chine",
    portArrivee: "Cotonou, Bénin",
    departureDate: "20 juin 2026",
    eta: "1 septembre 2026",
    currentStep: 4,
  },
  {
    code: "AT-2026-0788",
    container: "OOLU-1194502",
    vehicle: "Changan Hunter Pick-up — Blanc",
    client: "M. Dossou R.",
    vessel: "OOCL LAGOS",
    carrier: "OOCL",
    portDepart: "Shenzhen, Chine",
    portArrivee: "Cotonou, Bénin",
    departureDate: "5 septembre 2026",
    eta: "18 octobre 2026",
    currentStep: 1,
  },
];

export const findShipment = (code: string) =>
  SHIPMENTS.find((s) => s.code.toLowerCase() === code.trim().toLowerCase());

export const WHATSAPP_NUMBER = "22997000000";

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
