import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import suv from "@/assets/editorial-suv.jpg";
import sedan from "@/assets/editorial-sedan.jpg";
import terminal from "@/assets/editorial-terminal.jpg";
import logistics from "@/assets/editorial-logistics.jpg";
import { HERO_INTERVAL } from "./home-model";

const slides = [
  { src: suv, alt: "Vue illustrative d’un SUV premium devant une architecture contemporaine" },
  { src: sedan, alt: "Vue illustrative d’une berline électrique sur une route côtière" },
  { src: terminal, alt: "Illustration d’un parc automobile dans un terminal d’exportation" },
  { src: logistics, alt: "Illustration de la préparation d’un véhicule au transport" },
];
export function PhotoHero() {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);
  const [ref, api] = useEmblaCarousel({ loop: true, duration: reduced ? 0 : 40 });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change(); media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  const update = useCallback(() => setSelected(api?.selectedScrollSnap() ?? 0), [api]);
  useEffect(() => { if (!api) return; api.on("select", update); return () => { api.off("select", update); }; }, [api, update]);
  useEffect(() => {
    if (!api || reduced || paused) return;
    const timer = window.setInterval(() => { if (!document.hidden) api.scrollNext(); }, HERO_INTERVAL);
    return () => window.clearInterval(timer);
  }, [api, paused, reduced]);
  return <section className="hero-photographs" aria-label="Photographies automobiles et logistiques — visuels d’illustration" aria-roledescription="carrousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
    <div ref={ref} className="h-full overflow-hidden"><div className="flex h-full">{slides.map((slide, index) => <div key={slide.src} className="h-full min-w-0 flex-[0_0_100%]" aria-hidden={index !== selected}><img src={slide.src} alt={slide.alt} width={1920} height={1024} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} /></div>)}</div></div>
    <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6 sm:px-12">
      <Button size="icon" variant="ghost" className="hero-control" aria-label="Photographie précédente" onClick={() => api?.scrollPrev()}><ArrowLeft /></Button>
      <div className="flex items-center gap-2">{slides.map((slide, index) => <Button key={slide.src} variant="ghost" className="hero-pagination" aria-label={`Afficher la photographie ${index + 1}`} aria-current={selected === index} onClick={() => api?.scrollTo(index)} />)}<Button size="icon" variant="ghost" className="hero-control ml-3" aria-label={paused || reduced ? "Lancer le carrousel" : "Mettre le carrousel en pause"} disabled={reduced} onClick={() => setPaused((value) => !value)}>{paused || reduced ? <Play /> : <Pause />}</Button></div>
      <Button size="icon" variant="ghost" className="hero-control" aria-label="Photographie suivante" onClick={() => api?.scrollNext()}><ArrowRight /></Button>
    </div>
  </section>;
}
