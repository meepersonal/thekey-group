import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Search, Ship } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { CONTAINER_STAGES, useAdmin, type ContainerStage } from "@/data/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/conteneurs")({
  head: () => ({
    meta: [
      { title: "Suivi des conteneurs — Back-Office AutoTrack Bénin" },
      {
        name: "description",
        content:
          "Pilotez l'avancement maritime de chaque conteneur, du port de départ en Chine jusqu'à la livraison à Cotonou.",
      },
      { property: "og:title", content: "Suivi des conteneurs — Back-Office AutoTrack Bénin" },
      {
        property: "og:description",
        content: "Étapes logistiques, navires, ETA et notes internes pour chaque conteneur.",
      },
    ],
  }),
  component: AdminContainers,
});

function AdminContainers() {
  const { containers, updateContainer } = useAdmin();
  const [q, setQ] = useState("");
  const [openCode, setOpenCode] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      containers.filter((c) =>
        `${c.code} ${c.vessel} ${c.client} ${c.portDepart}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [containers, q],
  );
  const selected = containers.find((c) => c.code === openCode) ?? null;

  return (
    <div>
      <PageHeading
        title="Suivi des conteneurs"
        subtitle="Mettez à jour l'étape logistique de chaque conteneur : le client voit l'information en temps réel."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        {CONTAINER_STAGES.slice(1, 4).map((label, i) => (
          <div key={label} className="surface-card p-4">
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl font-extrabold">
              {containers.filter((c) => c.stage === i + 1).length}
            </p>
          </div>
        ))}
      </div>

      <div className="surface-card p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un conteneur, un navire, un client…"
            className="pl-9"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conteneur</TableHead>
                <TableHead>Navire / Départ</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Étape actuelle</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.code}>
                  <TableCell className="font-semibold">{c.code}</TableCell>
                  <TableCell className="text-sm">
                    <p className="font-medium">{c.vessel}</p>
                    <p className="text-xs text-muted-foreground">{c.portDepart}</p>
                  </TableCell>
                  <TableCell className="text-sm">{c.client}</TableCell>
                  <TableCell className="max-w-[260px] text-sm">
                    <span className="inline-flex items-center rounded-full bg-navy/10 px-2.5 py-1 text-[11px] font-bold text-navy">
                      {CONTAINER_STAGES[c.stage]}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{c.eta}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setOpenCode(c.code)}>
                      <Ship className="h-4 w-4" />
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Aucun conteneur ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setOpenCode(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.code}</DialogTitle>
                <DialogDescription>
                  {selected.vessel} — départ de {selected.portDepart} · Client : {selected.client}
                </DialogDescription>
              </DialogHeader>

              <ol className="space-y-3">
                {CONTAINER_STAGES.map((label, i) => {
                  const done = i <= selected.stage;
                  return (
                    <li key={label} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                          done
                            ? "bg-success text-success-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          i === selected.stage ? "font-bold" : "text-muted-foreground",
                        )}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Étape logistique</Label>
                  <Select
                    value={String(selected.stage)}
                    onValueChange={(v) => {
                      updateContainer(selected.code, {
                        stage: Number(v) as ContainerStage,
                      });
                      toast.success(`${selected.code} : ${CONTAINER_STAGES[Number(v)]}`);
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTAINER_STAGES.map((label, i) => (
                        <SelectItem key={label} value={String(i)}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eta">Date d'arrivée estimée</Label>
                  <Input
                    id="eta"
                    type="date"
                    className="mt-1.5"
                    value={selected.eta}
                    onChange={(e) => updateContainer(selected.code, { eta: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="note">Note interne / position actuelle</Label>
                <Textarea
                  id="note"
                  className="mt-1.5"
                  rows={3}
                  value={selected.note}
                  onChange={(e) => updateContainer(selected.code, { note: e.target.value })}
                />
              </div>

              <Button
                variant="accent"
                className="w-full"
                onClick={() => {
                  toast.success("Suivi du conteneur enregistré.");
                  setOpenCode(null);
                }}
              >
                Enregistrer le suivi
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
