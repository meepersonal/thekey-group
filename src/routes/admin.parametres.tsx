import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_CATEGORIES, BRANDS, fcfa } from "@/data/admin-store";

export const Route = createFileRoute("/admin/parametres")({
  head: () => ({
    meta: [
      { title: "Configuration — Back-Office AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Paramétrez les marques, catégories, options payantes et les coordonnées affichées sur le site public.",
      },
      { property: "og:title", content: "Configuration — Back-Office AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Marques, catégories, options payantes et informations de contact du site.",
      },
    ],
  }),
  component: AdminSettings,
});

type Opt = { id: string; label: string; price: number };

const INITIAL_OPTIONS: Opt[] = [
  { id: "o1", label: "Caméra 360°", price: 150000 },
  { id: "o2", label: "Chargeur rapide 7 kW", price: 250000 },
  { id: "o3", label: "Sièges cuir ventilés", price: 400000 },
  { id: "o4", label: "Teinte de vitres", price: 150000 },
  { id: "o6", label: "Jantes alliage 19″", price: 620000 },
];

function TagList({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold"
        >
          {item}
          <button
            onClick={() => onRemove(item)}
            aria-label={`Supprimer ${item}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </span>
      ))}
    </div>
  );
}

function AdminSettings() {
  const [brands, setBrands] = useState<string[]>([...BRANDS]);
  const [categories, setCategories] = useState<string[]>([...ADMIN_CATEGORIES]);
  const [options, setOptions] = useState<Opt[]>(INITIAL_OPTIONS);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [optLabel, setOptLabel] = useState("");
  const [optPrice, setOptPrice] = useState("");

  const [company, setCompany] = useState({
    name: "AutoTrack Bénin",
    phone: "+229 97 00 00 00",
    email: "mindsanni@gmail.com",
    address: "Calavi, Abomey-Calavi, Bénin",
    hours: "Lun – Sam : 8h00 – 19h00",
    about:
      "Importation de véhicules chinois neufs et d'occasion certifiée, avec suivi maritime jusqu'au Port de Cotonou.",
  });
  const [notifs, setNotifs] = useState({ email: true, whatsapp: true, weekly: false });

  return (
    <div>
      <PageHeading
        title="Configuration"
        subtitle="Marques, catégories, options payantes et informations affichées sur le site public."
      />

      <Tabs defaultValue="catalogue">
        <TabsList>
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="options">Options payantes</TabsTrigger>
          <TabsTrigger value="societe">Société</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <h2 className="font-display text-lg font-extrabold">Marques</h2>
            <div className="mt-3 flex gap-2">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Ex. HAVAL"
              />
              <Button
                variant="accent"
                onClick={() => {
                  const v = newBrand.trim().toUpperCase();
                  if (!v) return toast.error("Saisissez un nom de marque.");
                  if (brands.includes(v)) return toast.error("Cette marque existe déjà.");
                  setBrands((p) => [...p, v]);
                  setNewBrand("");
                  toast.success(`Marque ${v} ajoutée.`);
                }}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            <TagList
              items={brands}
              onRemove={(v) => {
                setBrands((p) => p.filter((x) => x !== v));
                toast.success(`Marque ${v} supprimée.`);
              }}
            />
          </div>

          <div className="surface-card p-5">
            <h2 className="font-display text-lg font-extrabold">Catégories</h2>
            <div className="mt-3 flex gap-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex. Minibus"
              />
              <Button
                variant="accent"
                onClick={() => {
                  const v = newCategory.trim();
                  if (!v) return toast.error("Saisissez une catégorie.");
                  if (categories.includes(v)) return toast.error("Cette catégorie existe déjà.");
                  setCategories((p) => [...p, v]);
                  setNewCategory("");
                  toast.success(`Catégorie ${v} ajoutée.`);
                }}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
            <TagList
              items={categories}
              onRemove={(v) => {
                setCategories((p) => p.filter((x) => x !== v));
                toast.success(`Catégorie ${v} supprimée.`);
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="options" className="mt-4">
          <div className="surface-card p-5">
            <h2 className="font-display text-lg font-extrabold">Options payantes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ces options sont proposées aux clients lors de la précommande d'un véhicule.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_180px_auto]">
              <Input
                value={optLabel}
                onChange={(e) => setOptLabel(e.target.value)}
                placeholder="Nom de l'option"
              />
              <Input
                value={optPrice}
                onChange={(e) => setOptPrice(e.target.value)}
                type="number"
                placeholder="Prix en FCFA"
              />
              <Button
                variant="accent"
                onClick={() => {
                  const price = Number(optPrice);
                  if (!optLabel.trim() || !price)
                    return toast.error("Renseignez un nom et un prix valides.");
                  setOptions((p) => [
                    ...p,
                    { id: crypto.randomUUID(), label: optLabel.trim(), price },
                  ]);
                  setOptLabel("");
                  setOptPrice("");
                  toast.success("Option ajoutée au catalogue.");
                }}
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            <ul className="mt-4 divide-y divide-border">
              {options.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-sm font-semibold">{o.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{fcfa(o.price)}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Supprimer ${o.label}`}
                      onClick={() => {
                        setOptions((p) => p.filter((x) => x.id !== o.id));
                        toast.success("Option supprimée.");
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="societe" className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-5">
            <h2 className="font-display text-lg font-extrabold">Coordonnées publiques</h2>
            <div className="mt-4 space-y-3">
              {(
                [
                  ["name", "Nom de la société"],
                  ["phone", "Téléphone / WhatsApp"],
                  ["email", "E-mail"],
                  ["address", "Adresse"],
                  ["hours", "Horaires"],
                ] as const
              ).map(([key, label]) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    className="mt-1.5"
                    value={company[key]}
                    onChange={(e) => setCompany((c) => ({ ...c, [key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <Label htmlFor="about">Présentation courte</Label>
                <Textarea
                  id="about"
                  rows={3}
                  className="mt-1.5"
                  value={company.about}
                  onChange={(e) => setCompany((c) => ({ ...c, about: e.target.value }))}
                />
              </div>
              <Button
                variant="accent"
                className="w-full"
                onClick={() => toast.success("Informations de la société enregistrées.")}
              >
                Enregistrer
              </Button>
            </div>
          </div>

          <div className="surface-card h-fit p-5">
            <h2 className="font-display text-lg font-extrabold">Notifications</h2>
            <div className="mt-4 space-y-4">
              {(
                [
                  ["email", "Alerte e-mail à chaque nouvelle précommande"],
                  ["whatsapp", "Alerte WhatsApp pour les acomptes reçus"],
                  ["weekly", "Rapport hebdomadaire d'activité"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">{label}</span>
                  <Switch
                    checked={notifs[key]}
                    onCheckedChange={(v) => {
                      setNotifs((n) => ({ ...n, [key]: v }));
                      toast.success(v ? "Notification activée." : "Notification désactivée.");
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
