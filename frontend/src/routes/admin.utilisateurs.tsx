import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  Mail,
  Calendar,
  Crown,
  UserCog,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useUsers,
  useUserRoles,
  useCreateUser,
  useUpdateUser,
  useToggleUserBlock,
  useDeleteUser,
} from "@/data/admin-store";
import type { AdminUser } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════
   INDICATEUR DE FORCE DU MOT DE PASSE
   ═══════════════════════════════════════════════════════════ */
function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }, [password]);

  const labels = ["Très faible", "Faible", "Moyen", "Fort", "Excellent"];

  const barColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-emerald-600",
  ];

  const textColors = [
    "text-red-600",
    "text-orange-600",
    "text-amber-600",
    "text-emerald-600",
    "text-emerald-700",
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < strength ? barColors[strength] : "bg-slate-200",
            )}
          />
        ))}
      </div>
      <p className={cn("text-[11px] font-semibold", textColors[strength])}>
        Force : {labels[strength]}
      </p>
    </div>
  );
}

const PER_PAGE = 10;

/* ═══════════════════════════════════════════════════════════
   RÔLES — labels + couleurs
   ═══════════════════════════════════════════════════════════ */
const ROLE_LABELS: Record<string, string> = {
  admin: "Administrateur",
  manager: "Manager",
  customer: "Client",
};

const ROLE_STYLES: Record<
  string,
  { bg: string; text: string; ring: string; icon: typeof Crown }
> = {
  admin: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    ring: "ring-violet-200",
    icon: Crown,
  },
  manager: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    ring: "ring-sky-200",
    icon: UserCog,
  },
  customer: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-200",
    icon: UserIcon,
  },
};

const emptyForm = () => ({ name: "", email: "", password: "", role: "customer" });

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sendCredentials, setSendCredentials] = useState(true);

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset[array[i]! % charset.length];
    }
    setForm({ ...form, password });
    setShowPassword(true);
    setCopied(false);
  };

  const copyPassword = async () => {
    if (!form.password) return;
    try {
      await navigator.clipboard.writeText(form.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le mot de passe.");
    }
  };

  const { data: rolesData } = useUserRoles();
  const roles = rolesData ?? ["admin", "manager", "customer"];

  const params = useMemo(() => {
    const p: Record<string, string> = { page: String(page), per_page: String(PER_PAGE) };
    if (query.trim()) p["search"] = query.trim();
    if (role !== "all") p["role"] = role;
    if (status !== "all") p["status"] = status;
    return p;
  }, [query, role, status, page]);

  const { data, isLoading } = useUsers(params);
  const users = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;

  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const toggleBlockMut = useToggleUserBlock();
  const deleteMut = useDeleteUser();

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowPassword(false);
    setCopied(false);
    setSendCredentials(true);
    setIsOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setShowPassword(false);
    setCopied(false);
    setIsOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Le nom et l'email sont obligatoires.");
      return;
    }
    if (!editing && form.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      if (editing) {
        const payload: { name: string; email: string; password?: string; role: string } = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await updateMut.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMut.mutateAsync({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          send_credentials: sendCredentials,
        });
      }
      setIsOpen(false);
      setEditing(null);
      setForm(emptyForm());
    } catch {
      // error handled by mutation
    }
  };

  const isBusy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Utilisateurs"
        subtitle="Gérez les comptes, les rôles et les accès à l'administration."
      />

      <div className="mb-4 flex justify-end">
        <Button
          onClick={openCreate}
          className="gap-2 bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30"
        >
          <UserPlus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FILTRES
      ═══════════════════════════════════════════════════════ */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un nom ou un email..."
            aria-label="Rechercher un utilisateur"
            className="pl-9"
          />
        </div>

        <Select
          value={role}
          onValueChange={(v) => {
            setRole(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filtrer par rôle">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {roles.map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABELS[r] ?? r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filtrer par statut">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="blocked">Bloqués</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ═══════════════════════════════════════════════════════
          LISTE
      ═══════════════════════════════════════════════════════ */}
      <div className="surface-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-emerald-50/40 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500 text-white">
              <UsersIcon className="h-3.5 w-3.5" />
            </span>
            {total} utilisateur{total > 1 ? "s" : ""}
          </p>
          {isLoading && (
            <span className="text-xs text-emerald-700/70">Chargement…</span>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            VUE MOBILE — CARDS
        ═══════════════════════════════════════════════════ */}
        <div className="divide-y divide-border/60 md:hidden">
          {users.length === 0 && !isLoading && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              Aucun utilisateur ne correspond à ces critères.
            </div>
          )}

          {users.map((u) => {
            const isSelf = currentUser?.id === u.id;
            const roleStyle = ROLE_STYLES[u.role] ?? ROLE_STYLES.customer;
            const RoleIcon = roleStyle.icon;

            return (
              <div key={u.id} className="p-4">
                {/* Ligne 1 : Avatar + Nom/Email + Statut */}
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">
                    {u.name.trim().charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {u.name}
                      {isSelf && (
                        <span className="ml-1.5 text-[10px] font-medium uppercase text-muted-foreground">
                          (vous)
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>

                  {u.is_blocked ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      <ShieldOff className="h-3 w-3" />
                      Bloqué
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <Check className="h-3 w-3" />
                      Actif
                    </span>
                  )}
                </div>

                {/* Ligne 2 : Rôle + Date */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-md border border-border/60 bg-slate-50 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Rôle
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset",
                        roleStyle.bg,
                        roleStyle.text,
                        roleStyle.ring,
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {ROLE_LABELS[u.role] ?? u.role}
                    </span>
                  </div>
                  <div className="rounded-md border border-border/60 bg-slate-50 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Créé le
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("fr-FR")
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Ligne 3 : Actions */}
                <div className="mt-3 flex items-center justify-end gap-1 border-t border-border/40 pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(u)}
                    className="h-8 gap-1.5 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isSelf || toggleBlockMut.isPending}
                    onClick={() => toggleBlockMut.mutate(u.id)}
                    className={cn(
                      "h-8 gap-1.5 px-2.5 text-xs font-medium",
                      u.is_blocked
                        ? "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                        : "text-red-600 hover:bg-red-50 hover:text-red-700",
                    )}
                  >
                    {u.is_blocked ? (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Activer
                      </>
                    ) : (
                      <>
                        <ShieldOff className="h-3.5 w-3.5" />
                        Bloquer
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isSelf}
                    onClick={() => setPendingDelete(u)}
                    className="h-8 gap-1.5 px-2.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Suppr.
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════
            VUE DESKTOP — TABLEAU
        ═══════════════════════════════════════════════════ */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-2.5 font-semibold">Utilisateur</th>
                <th className="px-4 py-2.5 font-semibold">Rôle</th>
                <th className="px-4 py-2.5 font-semibold">Statut</th>
                <th className="px-4 py-2.5 font-semibold">Créé le</th>
                <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Aucun utilisateur ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  const roleStyle = ROLE_STYLES[u.role] ?? ROLE_STYLES.customer;
                  const RoleIcon = roleStyle.icon;

                  return (
                    <tr
                      key={u.id}
                      className="border-b border-border/40 last:border-0 transition-colors hover:bg-emerald-50/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-sm">
                            {u.name.trim().charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {u.name}
                              {isSelf && (
                                <span className="ml-2 text-[10px] font-semibold uppercase text-slate-400">
                                  (vous)
                                </span>
                              )}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                              <Mail className="h-3 w-3 shrink-0" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
                            roleStyle.bg,
                            roleStyle.text,
                            roleStyle.ring,
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.is_blocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                            <ShieldOff className="h-3 w-3" />
                            Bloqué
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            <Check className="h-3 w-3" />
                            Actif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString("fr-FR")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Modifier ${u.name}`}
                            onClick={() => openEdit(u)}
                            className="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={u.is_blocked ? `Réactiver ${u.name}` : `Bloquer ${u.name}`}
                            disabled={isSelf || toggleBlockMut.isPending}
                            title={
                              isSelf
                                ? "Vous ne pouvez pas bloquer votre propre compte"
                                : undefined
                            }
                            onClick={() => toggleBlockMut.mutate(u.id)}
                            className={cn(
                              u.is_blocked
                                ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                : "text-red-500 hover:bg-red-50 hover:text-red-700",
                            )}
                          >
                            {u.is_blocked ? (
                              <ShieldCheck className="h-4 w-4" />
                            ) : (
                              <ShieldOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Supprimer ${u.name}`}
                            disabled={isSelf}
                            title={
                              isSelf
                                ? "Vous ne pouvez pas supprimer votre propre compte"
                                : undefined
                            }
                            onClick={() => setPendingDelete(u)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page {meta?.current_page} sur {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          FORMULAIRE
      ═══════════════════════════════════════════════════════ */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {/* Header coloré */}
          <div className="border-b border-emerald-200 bg-gradient-to-b from-emerald-50 to-white px-6 py-5">
            <SheetHeader className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-sm">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="font-display text-lg font-extrabold tracking-tight">
                    {editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                  </SheetTitle>
                  <SheetDescription className="mt-0.5 text-xs text-muted-foreground">
                    {editing
                      ? "Mettez à jour les informations de ce compte."
                      : "Créez un compte et attribuez son rôle."}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
          </div>

          <div className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="user-name">Nom complet</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jean.dupont@autotrack.bj"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="user-password">
                  Mot de passe{" "}
                  {editing && (
                    <span className="font-normal text-muted-foreground">
                      (laisser vide pour conserver)
                    </span>
                  )}
                </Label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Générer
                </button>
              </div>

              <div className="relative">
                <Input
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editing ? "••••••••" : "8 caractères minimum"}
                  autoComplete="new-password"
                  className="pr-20 font-mono"
                />

                <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                  {form.password && (
                    <button
                      type="button"
                      onClick={copyPassword}
                      aria-label="Copier le mot de passe"
                      className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                    className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {form.password && <PasswordStrength password={form.password} />}

              {!editing && (
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-sm text-slate-600 transition-colors hover:border-emerald-300">
                  <input
                    type="checkbox"
                    checked={sendCredentials}
                    onChange={(e) => setSendCredentials(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                  />
                  <span>
                    <span className="font-semibold text-emerald-900">
                      Envoyer les identifiants par e-mail
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-600">
                      Un message sera envoyé à {form.email || "l'adresse saisie"} avec l'e-mail et
                      le mot de passe pour se connecter à la plateforme.
                    </span>
                  </span>
                </label>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="user-role">Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => {
                    const rs = ROLE_STYLES[r] ?? ROLE_STYLES.customer;
                    const RIcon = rs.icon;
                    return (
                      <SelectItem key={r} value={r}>
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn(
                              "grid h-5 w-5 place-items-center rounded-full",
                              rs.bg,
                              rs.text,
                            )}
                          >
                            <RIcon className="h-3 w-3" />
                          </span>
                          {ROLE_LABELS[r] ?? r}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <KeyRound className="mt-0.5 h-3 w-3 shrink-0" />
                Seuls les administrateurs peuvent accéder au back-office.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border/60 px-6 py-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isBusy}>
              Annuler
            </Button>
            <Button
              onClick={submit}
              disabled={isBusy}
              className="bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
            >
              {isBusy ? "Enregistrement…" : editing ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ═══════════════════════════════════════════════════════
          CONFIRMATION SUPPRESSION
      ═══════════════════════════════════════════════════════ */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-red-100 sm:mx-0">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="font-display text-lg font-extrabold sm:text-left">
              Supprimer cet utilisateur ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-left">
              Le compte de{" "}
              <span className="font-semibold text-red-600">{pendingDelete?.name}</span> sera
              définitivement supprimé ainsi que ses sessions. Cette action est{" "}
              <strong className="text-red-600">irréversible</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingDelete && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-slate-50 p-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                {pendingDelete.name.trim().charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{pendingDelete.name}</p>
                <p className="truncate text-xs text-muted-foreground">{pendingDelete.email}</p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white shadow-md shadow-red-600/20 hover:bg-red-700"
              onClick={() => {
                if (pendingDelete) deleteMut.mutate(pendingDelete.id);
                setPendingDelete(null);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}