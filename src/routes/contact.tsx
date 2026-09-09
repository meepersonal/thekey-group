import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/data/tracking";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AutoTrack Bénin, Calavi / Abomey-Calavi" },
      {
        name: "description",
        content:
          "Contactez AutoTrack Bénin par WhatsApp, e-mail ou formulaire pour un devis d'importation de véhicule chinois et le suivi de votre conteneur.",
      },
      { property: "og:title", content: "Contact — AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Devis, suivi de conteneur et conseils : notre équipe répond sous 24 h ouvrées.",
      },
    ],
  }),
  component: ContactPage,
});

const SUBJECTS = ["Devis véhicule", "Suivi de conteneur", "Dédouanement", "Autre"];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Merci de remplir votre nom, téléphone et message.");
      return;
    }
    setSent(true);
    toast.success("Message envoyé !", {
      description: "Notre équipe vous répond sous 24 h ouvrées.",
    });
    setForm({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
  };

  return (
    <div>
      <section className="bg-gradient-navy py-14 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 text-xs font-semibold">
            <MessageCircle className="h-4 w-4 text-accent" />
            Nous sommes à l'écoute
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Contact</h1>
          <p className="mt-3 max-w-2xl text-navy-foreground/75">
            Une question sur un modèle, un devis ou votre conteneur en mer ? Écrivez-nous, nous
            répondons rapidement.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <form onSubmit={submit} className="surface-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">Envoyer un message</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Ex : Karim A."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                placeholder="+229 ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="vous@exemple.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <select
                id="subject"
                value={form.subject}
                onChange={(e) => set("subject")(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => set("message")(e.target.value)}
              placeholder="Décrivez votre besoin : modèle souhaité, budget, délai..."
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="accent" size="lg">
              <Send className="h-4 w-4" />
              Envoyer
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={waLink("Bonjour AutoTrack Bénin, j'aimerais des informations.")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {sent && (
            <p className="mt-4 text-sm text-success">
              Merci ! Votre message a bien été enregistré (démonstration).
            </p>
          )}
        </form>

        <aside className="space-y-4">
          <div className="surface-card p-6">
            <h2 className="font-display text-lg font-bold">Coordonnées</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:mindsanni@gmail.com" className="hover:text-accent">
                  mindsanni@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>+229 97 00 00 00 (WhatsApp)</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Calavi / Abomey-Calavi, Bénin</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Lundi – Samedi, 8h – 19h</span>
              </li>
            </ul>
          </div>

          <div className="surface-card overflow-hidden">
            <iframe
              title="Localisation AutoTrack Bénin à Abomey-Calavi"
              src="https://www.openstreetmap.org/export/embed.html?bbox=2.30%2C6.42%2C2.40%2C6.50&layer=mapnik"
              className="h-64 w-full border-0"
              loading="lazy"
            />
          </div>
        </aside>
      </section>
    </div>
  );
}
