import { useEffect } from "react";
import { ArrowRight, ArrowUpRight, Check, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { usePublicAgences, usePublicSettings } from "@/data/public-store";
import { PhotoHero } from "@/components/home/photo-hero";
import { HomeCatalogue } from "@/components/home/home-catalogue";
import { OperationsGallery } from "@/components/home/operations-gallery";
import { visiblePromotions } from "@/components/home/home-model";
import { useActivePromotions } from "@/hooks/use-active-promotions";
import { whatsappLink } from "@/lib/image";
import logistics from "@/assets/editorial-logistics.jpg";
import terminal from "@/assets/editorial-terminal.jpg";

const commitments = ["Recherche du véhicule adapté à votre besoin", "Accompagnement dans les démarches d’achat", "Coordination du transport vers votre pays", "Suivi de la commande et échanges réguliers"];
const steps = [
  ["Choix du véhicule", "Définissez le modèle et vos besoins avec notre équipe."],
  ["Validation du devis", "Échangez sur les conditions d’achat et de transport."],
  ["Organisation du transport", "Nous coordonnons l’expédition vers votre destination."],
  ["Suivi de la livraison", "Restez informé de l’avancement de votre commande."],
];
export function Index() {
  const { data: agencies = [], isLoading: agenciesLoading } = usePublicAgences();
  const { data: settings } = usePublicSettings();
  const { promotions } = useActivePromotions();
  const offers = visiblePromotions(promotions);
  const whatsapp = whatsappLink(settings?.phones?.find((phone) => phone.label.toLowerCase() === "whatsapp")?.value);
  const socials = settings?.socials?.filter((social) => social.url) ?? [];
  useEffect(() => {
    const title = "KEY GROUP — Véhicules de Chine, transport vers l’Afrique";
    const description = "Découvrez les véhicules proposés par KEY GROUP et échangez avec notre équipe pour votre achat en Chine et son transport vers l’Afrique.";
    document.title = title;
    const tags = [{ name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }];
    for (const tag of tags) {
      const attribute = "property" in tag ? "property" : "name";
      const key = "property" in tag ? tag.property : tag.name;
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.content = tag.content;
    }
    if (window.location.hash) window.setTimeout(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView(), 100);
  }, []);
  return <div className="home-page">
    <PhotoHero />
    <HomeCatalogue />
    <section id="services" className="editorial-section"><div className="editorial-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <figure className="min-w-0"><img src={logistics} alt="Illustration de préparation automobile au transport" width={1536} height={1024} loading="lazy" className="aspect-[5/6] w-full object-cover" /><figcaption className="mt-3 text-[10px] text-muted-foreground">Visuel d’illustration · Logistique automobile</figcaption></figure>
      <div><span className="editorial-kicker">02 / L’engagement KEY GROUP</span><h2 className="editorial-title">Votre projet automobile,<br />notre engagement.</h2><p className="mt-6 text-sm leading-7 text-muted-foreground">Acheter un véhicule en Chine demande un interlocuteur qui comprend votre projet. KEY GROUP vous accompagne dans le choix, l’achat et l’organisation du transport vers votre pays.</p><ul className="mt-7">{commitments.map((item) => <li key={item} className="flex gap-3 border-b border-border py-4 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}</ul><Button asChild className="mt-8 h-12 rounded-none px-6 text-xs"><Link to="/contact">Parlons de votre projet <ArrowUpRight /></Link></Button></div>
    </div></section>
    <section id="pourquoi-nous" className="bg-navy py-16 text-navy-foreground"><div className="editorial-container"><div className="grid gap-10 lg:grid-cols-[1fr_2fr]"><h2 className="text-2xl font-medium leading-snug">Pourquoi faire confiance<br />à KEY GROUP ?</h2><div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">{["Accompagnement personnalisé", "Coordination logistique", "Suivi des étapes", "Communication transparente"].map((item, index) => <div key={item} className="flex items-center gap-4 border-b border-navy-foreground/20 pb-5 text-sm"><span className="text-xs text-primary">0{index + 1}</span>{item}</div>)}</div></div></div></section>
    <section className="editorial-section"><div className="editorial-container"><span className="editorial-kicker">03 / Un parcours clair</span><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="editorial-title">De la Chine<br />à votre destination.</h2><Link to="/tracking" className="inline-flex items-center gap-3 text-sm">Suivre une commande <ArrowRight className="h-4 w-4" /></Link></div><div className="grid sm:grid-cols-4">{steps.map(([title, description], index) => <div className="home-step" key={title}><span className="text-3xl font-light text-muted-foreground">0{index + 1}</span><h3 className="mb-3 mt-5 text-sm font-bold">{title}</h3><p className="text-xs leading-6 text-muted-foreground">{description}</p></div>)}</div></div></section>
    <section id="agences" className="editorial-section border-t border-border"><div className="editorial-container grid gap-10 lg:grid-cols-[1fr_1.5fr]"><div><span className="editorial-kicker">04 / Une présence à vos côtés</span><h2 className="editorial-title">Retrouvez-nous<br />en Afrique.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">Un échange direct pour préciser votre besoin et préparer votre projet d’importation.</p></div><div>{agenciesLoading ? <p className="text-sm text-muted-foreground">Chargement des agences…</p> : agencies.filter((agency) => agency.is_active).length ? agencies.filter((agency) => agency.is_active).map((agency) => <article key={agency.id} className="border-t border-border py-7"><span className="text-[10px] uppercase text-muted-foreground">KEY GROUP / Agence</span><h3 className="mt-3 text-2xl font-medium">{agency.name}</h3><p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{agency.location}</p>{agency.phone && <a href={`tel:${agency.phone.replace(/[^+\d]/g, "")}`} className="mt-3 flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{agency.phone}</a>}{agency.hours && <p className="mt-3 text-xs text-muted-foreground">{agency.hours}</p>}<div className="mt-6 flex flex-wrap gap-6"><Button asChild variant="outline" className="rounded-none text-xs"><Link to="/contact">Nous contacter <ArrowUpRight /></Link></Button>{agency.map_url && <a href={agency.map_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs">Itinéraire <ArrowUpRight className="h-4 w-4" /></a>}</div></article>) : <div className="border-t border-border py-7"><p className="text-sm text-muted-foreground">Contactez notre équipe pour connaître votre interlocuteur local.</p><Button asChild variant="link" className="mt-4 p-0"><Link to="/contact">Nous contacter <ArrowRight /></Link></Button></div>}</div></div></section>
    <OperationsGallery />
    {offers.length > 0 && <section className="editorial-section"><div className="editorial-container"><span className="editorial-kicker">Actualités commerciales</span><h2 className="editorial-title mb-8">Offres du moment.</h2>{offers.map((offer) => <article key={offer.id} className="grid gap-5 border-t border-border py-8 md:grid-cols-2"><h3 className="text-2xl">{offer.title}</h3><div><p className="mb-5 text-sm text-muted-foreground">{offer.description}</p><Button asChild className="rounded-none"><a href={offer.ctaHref}>{offer.ctaLabel}<ArrowUpRight /></a></Button></div></article>)}</div></section>}
    {socials.length > 0 && <section className="editorial-section"><div className="editorial-container flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><span className="editorial-kicker">06 / Restons connectés</span><h2 className="editorial-title">KEY GROUP au quotidien.</h2></div><div className="flex flex-wrap gap-6">{socials.map((social) => <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 border-b border-border pb-3 text-sm">{social.platform}<ArrowUpRight className="h-4 w-4" /></a>)}</div></div></section>}
    <section className="home-final"><img src={terminal} alt="Illustration d’un terminal d’exportation automobile" width={1920} height={1024} loading="lazy" /><div className="editorial-container"><div className="home-final-content"><span className="mb-5 block text-[11px] uppercase text-navy-foreground/60">Votre prochain projet</span><h2 className="editorial-title">Vous recherchez un<br className="hidden sm:block" /> véhicule en Chine ?</h2><p className="mt-6 max-w-lg text-sm leading-7 text-navy-foreground/70">Présentez-nous votre projet et échangeons sur les possibilités d’achat et de transport vers votre pays.</p><div className="mt-8 flex flex-wrap gap-4"><Button asChild className="h-12 rounded-none px-6 text-xs"><Link to="/contact">Demander un devis <ArrowUpRight /></Link></Button>{whatsapp && <Button asChild variant="outlineLight" className="h-12 rounded-none px-6 text-xs"><a href={whatsapp} target="_blank" rel="noopener noreferrer">Nous contacter sur WhatsApp <ArrowUpRight /></a></Button>}</div></div></div></section>
  </div>;
}
