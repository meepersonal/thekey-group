import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { Eye, EyeClosed, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export function LoginPageImpl() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez renseigner votre email et mot de passe.");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Connexion réussie.");
      navigate("/admin");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Identifiants invalides.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a1512] px-6">
      {/* Décor de fond : blobs lumineux verts */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2DB569]/30 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#4FE492]/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4FE492]/10 blur-[100px]" />
      </div>

      {/* Grille subtile en arrière-plan */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Carte de connexion */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {/* Logo + marque */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2DB569] to-[#4FE492] shadow-lg shadow-[#2DB569]/30">
              <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              The key Group
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Connectez-vous pour accéder à votre flotte
            </p>
          </div>

          {/* Séparateur décoratif */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Connexion
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="h-12 rounded-xl border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder-white/30 backdrop-blur transition focus:border-[#4FE492] focus:bg-white/[0.06] focus:ring-2 focus:ring-[#4FE492]/30"
                required
                autoComplete="email"
              />
            </div>

            {/* Mot de passe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Mot de passe
                </Label>
                <button
                  type="button"
                  className="text-[11px] font-medium text-[#4FE492] transition hover:text-[#7df0b3]"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-white/10 bg-white/[0.04] px-4 pr-12 text-sm text-white placeholder-white/30 backdrop-blur transition focus:border-[#4FE492] focus:bg-white/[0.06] focus:ring-2 focus:ring-[#4FE492]/30"
                  required
                  autoComplete="current-password"
                />

                {/* Bouton Eye — TOUJOURS visible */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/5 hover:text-[#4FE492]"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeClosed className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton principal */}
            <Button
              type="submit"
              className="group h-12 w-full rounded-xl bg-gradient-to-r from-[#2DB569] to-[#4FE492] text-sm font-semibold text-white shadow-lg shadow-[#2DB569]/30 transition hover:shadow-[#2DB569]/50 hover:brightness-110"
              disabled={isLoading}
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? "Connexion..." : "Se connecter"}
                {!isLoading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}