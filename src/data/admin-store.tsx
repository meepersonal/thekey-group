import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type AdminVehicleStatus = "En Stock" | "Sur Commande" | "Masqué";
export type AdminOption = { id: string; label: string; price: number };

export type AdminVehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  energy: string;
  transmission: string;
  mileageKm: number;
  battery?: string;
  priceFcfa: number;
  status: AdminVehicleStatus;
  featured: boolean;
  image: string;
  options: AdminOption[];
};

export type OrderStatus = "Nouvelle demande" | "Prise en charge" | "Acompte Versé" | "Annulée";

export type AdminOrder = {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  city: string;
  vehicle: string;
  options: AdminOption[];
  basePrice: number;
  date: string;
  status: OrderStatus;
  containerCode?: string;
};

export type ContainerStage = 0 | 1 | 2 | 3 | 4;

export type AdminContainer = {
  code: string;
  vessel: string;
  portDepart: string;
  stage: ContainerStage;
  eta: string;
  client: string;
  note: string;
};

export const CONTAINER_STAGES = [
  "Commande confirmée / Préparation en Chine",
  "Chargement au Port de Départ",
  "En Transit Maritime",
  "Arrivé au Port de Cotonou / Dédouanement",
  "Véhicule Prêt / Livré au Client",
];

export const BRANDS = ["BYD", "CHANGAN", "JETOUR", "GAC", "CHERY"];
export const ADMIN_CATEGORIES = ["SUV", "Berline", "Utilitaire", "Électrique", "Hybride", "Pick-up"];

import suvWhite from "@/assets/car-suv-white.jpg";
import sedanBlue from "@/assets/car-sedan-blue.jpg";
import pickupGrey from "@/assets/car-pickup-grey.jpg";

const initialVehicles: AdminVehicle[] = [
  {
    id: "v1",
    brand: "BYD",
    model: "Song Plus EV",
    year: 2026,
    category: "Électrique",
    energy: "100% Électrique",
    transmission: "Automatique",
    mileageKm: 0,
    battery: "Blade 71,8 kWh — 505 km",
    priceFcfa: 18500000,
    status: "En Stock",
    featured: true,
    image: suvWhite,
    options: [
      { id: "o1", label: "Caméra 360°", price: 150000 },
      { id: "o2", label: "Chargeur rapide 7 kW", price: 250000 },
    ],
  },
  {
    id: "v2",
    brand: "CHANGAN",
    model: "UNI-K",
    year: 2025,
    category: "Hybride",
    energy: "Hybride",
    transmission: "Automatique 8 rapports",
    mileageKm: 0,
    priceFcfa: 21000000,
    status: "Sur Commande",
    featured: true,
    image: pickupGrey,
    options: [{ id: "o3", label: "Sièges cuir ventilés", price: 400000 }],
  },
  {
    id: "v3",
    brand: "JETOUR",
    model: "Dashing",
    year: 2026,
    category: "SUV",
    energy: "Essence",
    transmission: "Automatique 7 DCT",
    mileageKm: 0,
    priceFcfa: 14500000,
    status: "En Stock",
    featured: false,
    image: sedanBlue,
    options: [{ id: "o4", label: "Teinte de vitres", price: 150000 }],
  },
  {
    id: "v4",
    brand: "GAC",
    model: "Emkoo",
    year: 2026,
    category: "Hybride",
    energy: "Hybride",
    transmission: "Automatique",
    mileageKm: 0,
    priceFcfa: 16000000,
    status: "Masqué",
    featured: false,
    image: suvWhite,
    options: [],
  },
  {
    id: "v5",
    brand: "CHERY",
    model: "Tiggo 8 Pro",
    year: 2024,
    category: "SUV",
    energy: "Essence",
    transmission: "Automatique 7 DCT",
    mileageKm: 18500,
    priceFcfa: 13200000,
    status: "En Stock",
    featured: false,
    image: pickupGrey,
    options: [{ id: "o5", label: "Barres de toit", price: 120000 }],
  },
  {
    id: "v6",
    brand: "BYD",
    model: "Seal",
    year: 2026,
    category: "Berline",
    energy: "100% Électrique",
    transmission: "Automatique",
    mileageKm: 0,
    battery: "Blade 82,5 kWh — 570 km",
    priceFcfa: 24500000,
    status: "Sur Commande",
    featured: true,
    image: sedanBlue,
    options: [{ id: "o6", label: "Jantes alliage 19″", price: 620000 }],
  },
];

const initialOrders: AdminOrder[] = [
  {
    id: "RES-2026-001",
    clientName: "Koffi MENSAH",
    phone: "+229 97 00 11 22",
    email: "koffi.mensah@example.bj",
    city: "Cotonou",
    vehicle: "BYD Song Plus EV",
    options: [
      { id: "o1", label: "Caméra 360°", price: 150000 },
      { id: "o2", label: "Chargeur rapide 7 kW", price: 250000 },
    ],
    basePrice: 18500000,
    date: "2026-08-12",
    status: "Acompte Versé",
    containerCode: "CONT-2026-BYD88",
  },
  {
    id: "RES-2026-002",
    clientName: "Sègla DOSSOU",
    phone: "+229 95 33 44 55",
    email: "segla.dossou@example.bj",
    city: "Calavi",
    vehicle: "Changan UNI-K",
    options: [{ id: "o3", label: "Sièges cuir ventilés", price: 400000 }],
    basePrice: 21000000,
    date: "2026-08-20",
    status: "Prise en charge",
    containerCode: "CONT-2026-JET99",
  },
  {
    id: "RES-2026-003",
    clientName: "Adjovi SOGLO",
    phone: "+229 96 12 78 90",
    email: "adjovi.soglo@example.bj",
    city: "Porto-Novo",
    vehicle: "Jetour Dashing",
    options: [{ id: "o4", label: "Teinte de vitres", price: 150000 }],
    basePrice: 14500000,
    date: "2026-09-01",
    status: "Nouvelle demande",
  },
  {
    id: "RES-2026-004",
    clientName: "Sté Logibenin",
    phone: "+229 94 55 66 77",
    email: "contact@logibenin.bj",
    city: "Cotonou",
    vehicle: "GAC Emkoo",
    options: [],
    basePrice: 16000000,
    date: "2026-09-04",
    status: "Nouvelle demande",
  },
  {
    id: "RES-2026-005",
    clientName: "Rachidi DOSSOU",
    phone: "+229 91 22 33 44",
    email: "rachidi.d@example.bj",
    city: "Parakou",
    vehicle: "BYD Seal",
    options: [{ id: "o6", label: "Jantes alliage 19″", price: 620000 }],
    basePrice: 24500000,
    date: "2026-09-08",
    status: "Annulée",
  },
];

const initialContainers: AdminContainer[] = [
  {
    code: "CONT-2026-BYD88",
    vessel: "MSC ANTONIA",
    portDepart: "Shanghai",
    stage: 2,
    eta: "2026-09-25",
    client: "Koffi MENSAH",
    note: "Position actuelle : Golfe de Guinée",
  },
  {
    code: "CONT-2026-JET99",
    vessel: "CMA CGM BENIN",
    portDepart: "Ningbo",
    stage: 3,
    eta: "2026-09-12",
    client: "Sègla DOSSOU",
    note: "Dédouanement en cours au Port de Cotonou",
  },
  {
    code: "CONT-2026-GAC42",
    vessel: "OOCL LAGOS",
    portDepart: "Guangzhou",
    stage: 1,
    eta: "2026-10-18",
    client: "Sté Logibenin",
    note: "Chargement prévu ce vendredi",
  },
];

export const fcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " FCFA";

export const orderTotal = (o: AdminOrder) =>
  o.basePrice + o.options.reduce((s, x) => s + x.price, 0);

type Ctx = {
  vehicles: AdminVehicle[];
  orders: AdminOrder[];
  containers: AdminContainer[];
  saveVehicle: (v: AdminVehicle) => void;
  deleteVehicle: (id: string) => void;
  updateOrder: (id: string, patch: Partial<AdminOrder>) => void;
  updateContainer: (code: string, patch: Partial<AdminContainer>) => void;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [orders, setOrders] = useState(initialOrders);
  const [containers, setContainers] = useState(initialContainers);

  const saveVehicle = useCallback((v: AdminVehicle) => {
    setVehicles((prev) =>
      prev.some((x) => x.id === v.id) ? prev.map((x) => (x.id === v.id ? v : x)) : [v, ...prev],
    );
  }, []);
  const deleteVehicle = useCallback(
    (id: string) => setVehicles((prev) => prev.filter((v) => v.id !== id)),
    [],
  );
  const updateOrder = useCallback(
    (id: string, patch: Partial<AdminOrder>) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    [],
  );
  const updateContainer = useCallback(
    (code: string, patch: Partial<AdminContainer>) =>
      setContainers((prev) => prev.map((c) => (c.code === code ? { ...c, ...patch } : c))),
    [],
  );

  const value = useMemo(
    () => ({
      vehicles,
      orders,
      containers,
      saveVehicle,
      deleteVehicle,
      updateOrder,
      updateContainer,
    }),
    [vehicles, orders, containers, saveVehicle, deleteVehicle, updateOrder, updateContainer],
  );

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdmin must be used within AdminStoreProvider");
  return ctx;
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
