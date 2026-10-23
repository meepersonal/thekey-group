import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import terminal from "@/assets/editorial-terminal.jpg";
import logistics from "@/assets/editorial-logistics.jpg";
import suv from "@/assets/editorial-suv.jpg";

type OperationMedia = { src: string; category: string; title: string; kind: "photo" | "video" };
const media: OperationMedia[] = [
  { src: terminal, category: "Transport", title: "Au départ de la Chine", kind: "photo" },
  { src: logistics, category: "Chargement", title: "Préparation à l’expédition", kind: "photo" },
  { src: suv, category: "Livraison", title: "La réception du véhicule", kind: "photo" },
];
export function OperationsGallery() {
  const [filter, setFilter] = useState("Tout");
  const [selected, setSelected] = useState<OperationMedia | null>(null);
  const visible = media.filter((item) => filter === "Tout" || item.category === filter);
  return <section id="realisations" className="editorial-section bg-secondary"><div className="editorial-container">
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="editorial-kicker">05 / Sur le terrain</span><h2 className="editorial-title">Nos opérations<br />sur le terrain.</h2></div><p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Du parc automobile au port d’arrivée : chaque étape compte.</p></div>
    <div className="my-7 flex flex-wrap gap-x-6 gap-y-2" aria-label="Filtres des opérations">{["Tout", "Chargement", "Transport", "Déchargement", "Livraison"].map((item) => <Button variant="ghost" className={`h-9 rounded-none border-b-2 px-0 text-xs hover:bg-transparent ${filter === item ? "border-primary text-navy" : "border-transparent text-muted-foreground"}`} key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</Button>)}</div>
    {visible.length ? <div className="operations-grid">{visible.map((item) => <Button variant="ghost" key={item.src} className="group h-auto rounded-none p-0 hover:bg-transparent" aria-label={`Agrandir : ${item.title}`} onClick={() => setSelected(item)}><img src={item.src} alt={item.title + " — visuel de démonstration"} width={1536} height={1024} loading="lazy" className="transition-transform duration-500 group-hover:scale-[1.025]" /><span className="operations-caption">{item.title}</span><ArrowUpRight className="absolute right-4 top-4 text-navy-foreground" /></Button>)}</div> : <p className="border-t border-border py-12 text-sm text-muted-foreground">Les images de déchargement seront ajoutées prochainement.</p>}
    <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">Galerie de démonstration · Visuels d’illustration générés, et non des opérations réelles de KEY GROUP.</p>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="max-w-5xl p-4 sm:p-6"><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>Visuel de démonstration — ne représente pas une opération réelle de KEY GROUP.</DialogDescription>{selected?.kind === "video" ? <video src={selected.src} controls playsInline className="max-h-[70svh] w-full" /> : selected ? <img src={selected.src} alt={selected.title} className="max-h-[70svh] w-full object-contain" /> : null}</DialogContent></Dialog>
  </div></section>;
}
