import { useState } from "react";
import { Calendar, Clock, Check, Loader2, X, CalendarCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelect } from "@/components/ui/country-select";
import { formatFcfa } from "@/data/vehicles";
import {
    OPENING_HOURS_END,
    OPENING_HOURS_START,
    isWithinOpeningHours,
    openingHoursError,
} from "@/lib/appointment";
import { api } from "@/lib/api";
import type { Vehicle } from "@/lib/api";
import { useCreatePreorder } from "@/data/admin-store";

export function ReservationDrawer({
    open,
    onOpenChange,
    vehicle,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicle: Vehicle;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmation, setConfirmation] = useState<{
        code: string | null;
        reference: string;
        date: string;
        time: string;
    } | null>(null);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        date: "",
        time: "",
        notes: "",
    });
    const createPreorder = useCreatePreorder();

    const update = (key: keyof typeof form, value: string) => {
        setForm((f) => ({ ...f, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!form.fullName.trim()) {
            toast.error("Renseignez votre nom complet.");
            return;
        }
        if (!form.phone.trim()) {
            toast.error("Renseignez votre numéro de téléphone.");
            return;
        }
        if (!form.country) {
            toast.error("Sélectionnez un pays.");
            return;
        }
        if (!form.date) {
            toast.error("Choisissez une date de rendez-vous.");
            return;
        }
        if (!form.time) {
            toast.error("Choisissez une heure de rendez-vous.");
            return;
        }
        const timeError = openingHoursError(form.time);
        if (timeError) {
            toast.error(timeError);
            return;
        }

        const payload: Record<string, unknown> = {
            vehicle_id: vehicle.id,
            name: form.fullName,
            full_name: form.fullName,
            phone: form.phone,
            city: form.city,
            country: form.country,
            appointment_date: form.date,
            appointment_time: form.time,
            notes: form.notes,
        };
        if (form.email) payload["email"] = form.email;

        setIsSubmitting(true);
        try {
            const created = await createPreorder.mutateAsync(
                payload as Parameters<typeof api.createPreorder>[0],
            );
            setConfirmation({
                code: created.data.appointment_code ?? null,
                reference: created.data.reference,
                date: form.date,
                time: form.time,
            });
            setForm({
                fullName: "",
                email: "",
                phone: "",
                country: "",
                city: "",
                date: "",
                time: "",
                notes: "",
            });
        } catch {
            toast.error("Une erreur est survenue. Réessayez.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Sheet open={open && !confirmation} onOpenChange={onOpenChange}>
                <SheetContent
                    side="right"
                    className="flex h-full w-full flex-col gap-0 overflow-hidden border-l-0 bg-slate-50 p-0 !max-w-full"
                >
                    {/* ═══════════ HEADER ═══════════ */}
                    <div className="relative border-b border-slate-200 bg-white px-6 py-5 sm:px-10 lg:px-16">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Fermer"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mx-auto max-w-4xl">
                            <SheetHeader className="space-y-2 text-left">
                                <span className="inline-flex w-fit items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                                    <Calendar className="h-3 w-3" />
                                    Rendez-vous en agence
                                </span>
                                <SheetTitle className="text-xl font-bold text-slate-900 sm:text-2xl">
                                    Réserver votre RDV en agence
                                </SheetTitle>
                                <SheetDescription className="text-sm text-slate-500">
                                    {vehicle.brand} {vehicle.model} ({vehicle.year}) —{" "}
                                    <span className="font-semibold text-slate-900">
                                        {formatFcfa(vehicle.price_fcfa)}
                                    </span>
                                </SheetDescription>
                            </SheetHeader>
                        </div>
                    </div>

                    {/* ═══════════ CONTENU SCROLLABLE ═══════════ */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-16">
                        <div className="mx-auto max-w-4xl space-y-10">
                            {/* ═══ SECTION 1 : Coordonnées ═══ */}
                            <section>
                                <div className="mb-5 border-b border-slate-200 pb-3">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                        Vos coordonnées
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Ces informations nous permettront de vous recontacter.
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">
                                            Nom complet <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={form.fullName}
                                            onChange={(e) => update("fullName", e.target.value)}
                                            placeholder="Ex : Adjoa Mensah"
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                            Adresse e-mail
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => update("email", e.target.value)}
                                            placeholder="vous@exemple.com"
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                            Téléphone / WhatsApp <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => update("phone", e.target.value)}
                                            placeholder="+229 97 00 00 00"
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ═══ SECTION 2 : Localisation ═══ */}
                            <section>
                                <div className="mb-5 border-b border-slate-200 pb-3">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                        Votre localisation
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Où résidez-vous actuellement ?
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-sm font-medium text-slate-700">
                                            Pays <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="mt-2">
                                            <CountrySelect
                                                value={form.country}
                                                onChange={(v) => update("country", v)}
                                                placeholder="Rechercher un pays..."
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                                            Ville
                                        </Label>
                                        <Input
                                            id="city"
                                            value={form.city}
                                            onChange={(e) => update("city", e.target.value)}
                                            placeholder="Ex : Cotonou"
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ═══ SECTION 3 : Rendez-vous ═══ */}
                            <section>
                                <div className="mb-5 border-b border-slate-200 pb-3">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                                        Date et heure du rendez-vous
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Choisissez un créneau pour visiter le véhicule en agence.
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                                            Date souhaitée <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={form.date}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => update("date", e.target.value)}
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="time"
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Heure souhaitée <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="time"
                                            type="time"
                                            value={form.time}
                                            min={OPENING_HOURS_START}
                                            max={OPENING_HOURS_END}
                                            step="1800"
                                            aria-invalid={
                                                Boolean(form.time) && !isWithinOpeningHours(form.time)
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                update("time", value);
                                                if (value && !isWithinOpeningHours(value)) {
                                                    toast.error(
                                                        `Heure invalide : nos agences sont ouvertes de ${OPENING_HOURS_START} à ${OPENING_HOURS_END}.`,
                                                    );
                                                }
                                            }}
                                            className="mt-2 h-12 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                        {form.time && !isWithinOpeningHours(form.time) && (
                                            <p className="mt-1.5 text-xs text-red-500">
                                                Créneau indisponible : choisissez une heure entre{" "}
                                                {OPENING_HOURS_START} et {OPENING_HOURS_END}.
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <p className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
                                            <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                            Disponibilités : lundi – samedi, {OPENING_HOURS_START} à{" "}
                                            {OPENING_HOURS_END} (hors jours fériés)
                                        </p>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                                            Notes supplémentaires
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={form.notes}
                                            onChange={(e) => update("notes", e.target.value)}
                                            placeholder="Questions, préférences, informations complémentaires..."
                                            rows={4}
                                            className="mt-2 rounded-lg border-slate-300 bg-white text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ═══ INFO RÉSERVATION ═══ */}
                            <div className="flex items-start gap-3.5 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-emerald-600 text-white">
                                    <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-emerald-900">
                                        Réservation gratuite et sans engagement
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-emerald-800/80">
                                        Aucun paiement requis. Un conseiller vous recontacte sous 24h pour confirmer votre rendez-vous.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════ FOOTER STICKY ═══════════ */}
                    <div className="border-t border-slate-200 bg-white px-6 py-4 sm:px-10 lg:px-16">
                        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
                            <p className="hidden text-xs text-slate-500 sm:block">
                                Les champs marqués <span className="text-red-500">*</span> sont obligatoires
                            </p>
                            <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="h-11 flex-1 rounded-lg border-slate-300 px-5 text-sm font-semibold sm:flex-none"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="h-11 flex-1 rounded-lg bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-70 sm:flex-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Envoi en cours…
                                        </>
                                    ) : (
                                        <>
                                            <CalendarCheck className="mr-2 h-4 w-4" />
                                            Confirmer le rendez-vous
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog
                open={Boolean(confirmation)}
                onOpenChange={(next) => {
                    if (!next) {
                        setConfirmation(null);
                        onOpenChange(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
                            <CalendarCheck className="h-7 w-7 text-emerald-600" />
                        </span>
                        <DialogTitle className="text-center">Rendez-vous enregistré</DialogTitle>
                        <DialogDescription className="text-center">
                            Présentez ce code à l'accueil de l'agence. Un conseiller vous recontacte
                            sous 24h pour confirmer le créneau.
                        </DialogDescription>
                    </DialogHeader>

                    {confirmation?.code && (
                        <button
                            type="button"
                            onClick={() => {
                                const code = confirmation?.code;
                                if (!code) return;
                                navigator.clipboard
                                    ?.writeText(code)
                                    .then(() => toast.success("Code copié."))
                                    .catch(() => toast.error("Copie impossible."));
                            }}
                            className="group mx-auto flex flex-col items-center gap-1 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 px-8 py-5 transition-colors hover:bg-emerald-50"
                            aria-label="Copier le code de rendez-vous"
                        >
                            <span className="text-3xl font-black tracking-[0.35em] text-emerald-700">
                                {confirmation.code}
                            </span>
                            <span className="text-[11px] uppercase tracking-wider text-slate-500 group-hover:text-slate-700">
                                Cliquer pour copier
                            </span>
                        </button>
                    )}

                    <div className="space-y-1.5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        <p>
                            <span className="font-semibold text-slate-900">Dossier :</span>{" "}
                            {confirmation?.reference}
                        </p>
                        <p>
                            <span className="font-semibold text-slate-900">Véhicule :</span>{" "}
                            {vehicle.brand} {vehicle.model}
                        </p>
                        {confirmation?.date && (
                            <p>
                                <span className="font-semibold text-slate-900">Créneau :</span>{" "}
                                {new Date(`${confirmation.date}T00:00:00`).toLocaleDateString(
                                    "fr-FR",
                                )}
                                {confirmation.time ? ` à ${confirmation.time}` : ""}
                            </p>
                        )}
                    </div>

                    <Button
                        type="button"
                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => {
                            setConfirmation(null);
                            onOpenChange(false);
                        }}
                    >
                        Fermer
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}