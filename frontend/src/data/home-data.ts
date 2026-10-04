import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeDollarSign,
  BatteryCharging,
  Building2,
  Cpu,
  CreditCard,
  Eye,
  FileCheck2,
  Headphones,
  MapPin,
  Repeat,
  ShieldCheck,
  Star,
  Users,
  ClipboardCheck,
  PackageCheck,
  Ship,
  Wrench,
} from "lucide-react";

export interface Stat {
  value: string;
  label: string;
}

export interface WhyUsItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface WhyChineseItem {
  icon: LucideIcon;
  stat: string;
  title: string;
  description: string;
}

export interface Testimonial {
  tiktokUrl?: string;
  poster?: string;
}

export interface TrustBadge {
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface TrustPartner {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

export interface Agency {
  id: string;
  city: string;
  country: string;
  postalCode: string;
  address: string;
  phone: string;
  hours: string;
  region: string;
  open: boolean;
  mapX: number;
  mapY: number;
}

export const STATS: Stat[] = [
  { value: "480+", label: "Véhicules livrés" },
  { value: "35 j", label: "Délai moyen Chine → Cotonou" },
  { value: "9", label: "Marques partenaires" },
  { value: "24/7", label: "Suivi de conteneur" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    tiktokUrl: "https://www.tiktok.com/@the.key.group/video/7657912724487294229",
  },
  {
    tiktokUrl: "https://www.tiktok.com/@the.key.group/video/XXXXXXXXXXXXX",
  },
  {
    tiktokUrl: "https://www.tiktok.com/@the.key.group/video/YYYYYYYYYYYYY",
  },
];

export const WHY_US: WhyUsItem[] = [
  {
    icon: Award,
    title: "Expertise exclusive véhicules chinois",
    description:
      "Nous ne vendons que des voitures chinoises. C'est notre spécialité, pas un produit d'appel. Nous connaissons chaque modèle, chaque motorisation, chaque pièce.",
  },
  {
    icon: MapPin,
    title: "Essais organisés près de chez vous",
    description:
      "Pas besoin de venir à Paris ou Marseille. Nous organisons des journées d'essai dans plusieurs villes de France, avec les modèles qui vous intéressent.",
  },
  {
    icon: FileCheck2,
    title: "Accompagnement complet, de A à Z",
    description:
      "Reprise de votre ancien véhicule, financement, immatriculation, livraison : un seul interlocuteur gère tout. Vous n'avez rien à faire.",
  },
  {
    icon: Headphones,
    title: "SAV et suivi réellement local",
    description:
      "Un vrai service après-vente en France, joignable par téléphone, avec des partenaires agréés pour l'entretien et les réparations.",
  },
  {
    icon: Eye,
    title: "Transparence totale sur les délais et les prix",
    description:
      "Prix affichés en FCFA et en euros, délais annoncés et respectés. Aucun frais caché, aucune surprise à la livraison.",
  },
  {
    icon: Users,
    title: "Équipe francophone et joignable",
    description:
      "Une équipe basée en France, qui parle votre langue, répond à vos questions et vous suit jusqu'à la remise des clés.",
  },
];

export const REGIONS = ["Toutes", "Île-de-France", "Sud-Est", "Sud-Ouest", "Nord", "Ouest"];

export const AGENCIES: Agency[] = [
  {
    id: "paris",
    city: "Paris",
    country: "France",
    postalCode: "75011",
    address: "42 rue de la Roquette",
    phone: "+33 1 23 45 67 89",
    hours: "Lun–Sam · 9h–19h",
    region: "Île-de-France",
    open: true,
    mapX: 52,
    mapY: 28,
  },
  {
    id: "lyon",
    city: "Lyon",
    country: "France",
    postalCode: "69003",
    address: "18 avenue Jean Jaurès",
    phone: "+33 4 23 45 67 89",
    hours: "Lun–Sam · 9h–19h",
    region: "Sud-Est",
    open: true,
    mapX: 60,
    mapY: 52,
  },
  {
    id: "marseille",
    city: "Marseille",
    country: "France",
    postalCode: "13006",
    address: "7 rue Paradis",
    phone: "+33 4 91 23 45 67",
    hours: "Lun–Sam · 9h–18h",
    region: "Sud-Est",
    open: true,
    mapX: 62,
    mapY: 72,
  },
  {
    id: "bordeaux",
    city: "Bordeaux",
    country: "France",
    postalCode: "33000",
    address: "25 cours de l'Intendance",
    phone: "+33 5 56 23 45 67",
    hours: "Lun–Sam · 9h–19h",
    region: "Sud-Ouest",
    open: false,
    mapX: 32,
    mapY: 60,
  },
  {
    id: "lille",
    city: "Lille",
    country: "France",
    postalCode: "59000",
    address: "12 rue Faidherbe",
    phone: "+33 3 20 23 45 67",
    hours: "Lun–Sam · 9h–19h",
    region: "Nord",
    open: true,
    mapX: 55,
    mapY: 8,
  },
  {
    id: "nantes",
    city: "Nantes",
    country: "France",
    postalCode: "44000",
    address: "9 rue Crébillon",
    phone: "+33 2 40 23 45 67",
    hours: "Lun–Sam · 9h–18h",
    region: "Ouest",
    open: true,
    mapX: 22,
    mapY: 38,
  },
];

export const TRUST_BADGES: TrustBadge[] = [
  { icon: Star, value: "4,9 / 5", label: "Note Google" },
  { icon: Users, value: "480+", label: "Clients livrés" },
  { icon: Repeat, value: "62 %", label: "Clients qui recommandent" },
];

export const WHY_CHINESE: WhyChineseItem[] = [
  {
    icon: ClipboardCheck,
    stat: "Étape 01",
    title: "Précommande en ligne",
    description:
      "Remplissez le formulaire de précommande en moins de deux minutes. Aucun paiement requis, vous réservez votre futur véhicule.",
  },
  {
    icon: Building2,
    stat: "Étape 02",
    title: "Passage à l'agence de votre pays",
    description:
      "Rendez-vous dans notre agence locale pour finaliser votre achat : signature des documents, vérification du véhicule, validation du financement.",
  },
  {
    icon: Ship,
    stat: "Étape 03",
    title: "Suivi de votre acquisition",
    description:
      "Suivez en temps réel l'avancement de votre commande : fabrication, transport maritime, dédouanement. Vous recevez une notification à chaque étape clé.",
  },
  {
    icon: PackageCheck,
    stat: "Étape 04",
    title: "Récupération dans votre pays",
    description:
      "Votre véhicule est livré au Port de Cotonou, entièrement dédouané et prêt à être récupéré. Nous gérons toutes les formalités pour vous.",
  },
];

export const TRUST_PARTNERS: TrustPartner[] = [
  {
    icon: CreditCard,
    title: "Financement sur mesure",
    description:
      "Crédit classique, LOA ou leasing avec ou sans apport. Nous négocions pour vous les meilleurs taux auprès de nos banques partenaires.",
    tag: "Taux préférentiels",
  },
  {
    icon: ShieldCheck,
    title: "Assurance tous risques",
    description:
      "Votre véhicule est couvert de bout en bout : transport maritime, dédouanement et premiers mois sur route. Aucune mauvaise surprise.",
    tag: "Transport couvert",
  },
  {
    icon: Building2,
    title: "Dédouanement officiel",
    description:
      "Nos transitaires agréés s'occupent de toutes les formalités douanières. Vous n'avez aucune démarche administrative à faire.",
    tag: "Transitaires agréés",
  },
  {
    icon: FileCheck2,
    title: "Immatriculation incluse",
    description:
      "Carte grise, plaques, documents officiels : nous gérons tout de A à Z. Vous récupérez un véhicule prêt à rouler.",
    tag: "Service inclus",
  },
];
