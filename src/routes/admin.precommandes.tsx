import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, MessageCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { OrderStatusBadge } from "@/components/admin/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fcfa, orderTotal, useAdmin, type OrderStatus } from "@/data/admin-store";

export const Route = createFileRoute("/admin/precommandes")({
  head: () => ({
    meta: [
      { title: "Précommandes & prospects — Back-Office AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Suivez les précommandes clients, les options choisies et relancez les prospects par WhatsApp.",
      },
      { property: "og:title", content: "Précommandes & prospects — Back-Office AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Dossiers clients, statuts, montants devisés et association aux conteneurs.",
      },
    ],
  }),
  component: AdminOrders,
});

const STATUSES: OrderStatus[] = [
  "Nouvelle demande",
  "Prise en charge",
  "Acompte Versé",
  "Annulée",
];
const PER_PAGE = 5;

function AdminOrders() {
  const { orders, containers, updateOrder } = useAdmin();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter(
        (o) =>
          `${o.id} ${o.clientName} ${o.vehicle} ${o.phone}`
            .toLowerCase()
            .includes(q.toLowerCase()) && (status === "all" || o.status === status),
      ),
    [orders, q, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const selected = orders.find((o) => o.id === openId) ?? null;

  const whatsapp = (phone: string, text: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

  return (
    <div>
      <PageHeading
        title="Précommandes & prospects"
        subtitle="Gérez les demandes de réservation et le suivi commercial des clients."
      />

      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un client, un n° de réservation…"
              className="pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Réservation</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Options</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-semibold">{o.id}</TableCell>
                  <TableCell>
                    <p className="font-semibold">{o.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.phone} · {o.email}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm">{o.vehicle}</TableCell>
                  <TableCell className="text-sm">{o.options.length} option(s)</TableCell>
                  <TableCell className="text-sm">{o.date}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Voir le dossier"
                        onClick={() => setOpenId(o.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" asChild aria-label="WhatsApp">
                        <a
                          href={whatsapp(
                            o.phone,
                            `Bonjour ${o.clientName}, votre dossier ${o.id} (${o.vehicle}) chez AutoTrack Bénin.`,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MessageCircle className="h-4 w-4 text-success" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Aucune précommande ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {filtered.length} dossier(s) — page {current} / {pages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
            >
              Précédent
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Dossier {selected.id}</DialogTitle>
                <DialogDescription>
                  Demande du {selected.date} — {selected.vehicle}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border border-border p-4 text-sm">
                <p className="font-bold">{selected.clientName}</p>
                <p className="text-muted-foreground">
                  {selected.phone} · {selected.email}
                </p>
                <p className="text-muted-foreground">{selected.city}, Bénin</p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <p className="text-sm font-bold">Détail du devis</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>{selected.vehicle}</span>
                    <span className="font-semibold">{fcfa(selected.basePrice)}</span>
                  </div>
                  {selected.options.map((o) => (
                    <div key={o.id} className="flex justify-between text-muted-foreground">
                      <span>{o.label}</span>
                      <span>+ {fcfa(o.price)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-base font-extrabold">
                    <span>Total devisé</span>
                    <span>{fcfa(orderTotal(selected))}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Associer à un conteneur</Label>
                  <Select
                    value={selected.containerCode ?? "none"}
                    onValueChange={(v) => {
                      updateOrder(selected.id, {
                        containerCode: v === "none" ? undefined : v,
                      });
                      toast.success(
                        v === "none" ? "Conteneur dissocié." : `Dossier associé à ${v}.`,
                      );
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Aucun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun conteneur</SelectItem>
                      {containers.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} — {c.vessel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Changer le statut</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => {
                      updateOrder(selected.id, { status: v as OrderStatus });
                      toast.success(`Statut mis à jour : ${v}.`);
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button asChild variant="accent" className="w-full">
                <a
                  href={whatsapp(
                    selected.phone,
                    `Bonjour ${selected.clientName}, votre dossier ${selected.id} pour ${selected.vehicle} (total ${fcfa(orderTotal(selected))}) est suivi par AutoTrack Bénin.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Envoyer une relance WhatsApp
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
