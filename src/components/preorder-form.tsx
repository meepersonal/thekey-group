import { useState } from "react";
import { CheckCircle2, Download, FileText, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { waLink } from "@/data/tracking";
import { formatFcfa, formatUsd, type Vehicle, type VehicleOption } from "@/data/vehicles";

type Props = {
  vehicle: Vehicle;
  selected: VehicleOption[];
  total: number;
};

export function PreorderForm({ vehicle, selected, total }: Props) {
  const [form, setForm] = useState({
    name: "",
    dial: "+229",
    phone: "",
    email: "",
    city: "",
    notes: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const optionsText = selected.length
    ? selected.map((o) => `- ${o.label} (${formatFcfa(o.price)})`).join("\n")
    : "- Aucune option supplémentaire";

  const summary = `Nouvelle précommande — AutoTrack Bénin
Véhicule : ${vehicle.brand} ${vehicle.model} (${vehicle.year})
État : ${vehicle.condition}
Options :
${optionsText}
Total estimé : ${formatFcfa(total)} (≈ ${formatUsd(total)})

Client : ${form.name}
Téléphone : ${form.dial} ${form.phone}
E-mail : ${form.email}
Ville : ${form.city}
Notes : ${form.notes || "—"}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Merci de renseigner votre nom et votre téléphone.");
      return;
    }
    toast.success("Votre demande de précommande a bien été enregistrée !");
    setConfirmOpen(true);
  };

  const downloadPdf = () => {
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Autorisez les fenêtres pop-up pour générer le récapitulatif.");
      return;
    }
    w.document.write(`<html><head><title>Recapitulatif-precommande-${vehicle.id}</title>
      <style>body{font-family:system-ui,sans-serif;padding:40px;color:#0F172A}
      h1{color:#0F172A;margin-bottom:4px}h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#EA580C;margin-top:28px}
      table{width:100%;border-collapse:collapse;margin-top:8px}td{padding:8px 0;border-bottom:1px solid #E2E8F0;font-size:14px}
      .total{font-size:20px;font-weight:800;margin-top:16px}</style></head><body>
      <h1>AutoTrack Bénin</h1><p>Récapitulatif de précommande — ${new Date().toLocaleDateString("fr-FR")}</p>
      <h2>Véhicule</h2><table>
      <tr><td>Modèle</td><td><b>${vehicle.brand} ${vehicle.model}</b></td></tr>
      <tr><td>Année</td><td>${vehicle.year}</td></tr>
      <tr><td>État</td><td>${vehicle.condition}</td></tr>
      <tr><td>Prix de base</td><td>${formatFcfa(vehicle.priceFcfa)}</td></tr></table>
      <h2>Options sélectionnées</h2><table>
      ${
        selected.length
          ? selected.map((o) => `<tr><td>${o.label}</td><td>${formatFcfa(o.price)}</td></tr>`).join("")
          : "<tr><td>Aucune option</td><td>—</td></tr>"
      }</table>
      <p class="total">Total estimé : ${formatFcfa(total)} (≈ ${formatUsd(total)})</p>
      <h2>Client</h2><table>
      <tr><td>Nom</td><td>${form.name}</td></tr>
      <tr><td>Téléphone</td><td>${form.dial} ${form.phone}</td></tr>
      <tr><td>E-mail</td><td>${form.email}</td></tr>
      <tr><td>Ville</td><td>${form.city}</td></tr>
      <tr><td>Notes</td><td>${form.notes || "—"}</td></tr></table>
      <p style="margin-top:32px;font-size:12px;color:#64748B">Prix indicatifs hors droits de douane. mindsanni@gmail.com — Calavi, Bénin.</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <>
      <form onSubmit={submit} className="surface-card space-y-5 p-6" id="precommande">
        <div>
          <h3 className="text-xl font-bold">Formulaire de précommande</h3>
          <p className="text-sm text-muted-foreground">
            Nous vous recontactons sous 24h pour confirmer votre commande.
          </p>
        </div>

        <div className="rounded-xl bg-secondary p-4">
          <div className="flex items-center gap-3">
            <img
              src={vehicle.images[0]}
              alt={vehicle.model}
              loading="lazy"
              width={1200}
              height={800}
              className="h-16 w-24 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="truncate font-bold">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-xs text-muted-foreground">
                {selected.length} option(s) — {vehicle.condition}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-sm text-muted-foreground">Total estimé</span>
            <span className="text-lg font-extrabold">{formatFcfa(total)}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex : Koffi Adjovi"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
            <div className="mt-1.5 flex gap-2">
              <select
                value={form.dial}
                onChange={(e) => setForm({ ...form, dial: e.target.value })}
                aria-label="Indicatif pays"
                className="h-9 shrink-0 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="+229">🇧🇯 +229</option>
                <option value="+228">🇹🇬 +228</option>
                <option value="+234">🇳🇬 +234</option>
                <option value="+225">🇨🇮 +225</option>
                <option value="+33">🇫🇷 +33</option>
              </select>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="97 00 00 00"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@email.com"
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="city">Ville / Localisation</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Cotonou, Calavi, Parakou…"
              className="mt-1.5"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes">Message / Notes spécifiques</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Couleur souhaitée, délai, mode de paiement…"
              className="mt-1.5"
              rows={4}
            />
          </div>
        </div>

        <Button type="submit" variant="accent" size="xl" className="w-full">
          <Send className="h-4 w-4" />
          Envoyer ma précommande
        </Button>
      </form>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-success/15">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </span>
            <DialogTitle className="text-center">Demande enregistrée !</DialogTitle>
            <DialogDescription className="text-center">
              Votre précommande pour la {vehicle.brand} {vehicle.model} a bien été reçue. Finalisez
              en un clic sur WhatsApp ou téléchargez votre récapitulatif.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl bg-secondary p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total estimé</span>
              <span className="font-extrabold">{formatFcfa(total)}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Button asChild variant="accent" size="lg">
              <a href={waLink(summary)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Finaliser sur WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={downloadPdf}>
              <Download className="h-4 w-4" />
              Télécharger le récapitulatif PDF
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Référence : PRE-{vehicle.id.toUpperCase().slice(0, 6)}-{Date.now().toString().slice(-4)}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
