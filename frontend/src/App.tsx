import { type ReactNode } from "react";
import { RouterProvider, useRouterState } from "@/lib/router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { useDocumentBranding } from "@/data/public-store";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageNotFound } from "@/components/page-not-found";
import { AdminShell } from "@/components/admin/admin-shell";

import { Index } from "@/routes/index";
import { AboutPage } from "@/routes/a-propos";
import { CataloguePage } from "@/routes/catalogue";
import { ContactPage } from "@/routes/contact";
import { PartnersPage } from "@/routes/partenaires";
import { TrackingPage } from "@/routes/tracking";
import { VehiclePage } from "@/routes/vehicules.$id";
import { AdminDashboard } from "@/routes/admin.index";
import { AdminCatalogue } from "@/routes/admin.catalogue";
import { AdminContainers } from "@/routes/admin.conteneurs";
import { AdminOrders } from "@/routes/admin.precommandes";
import { AdminSettings } from "@/routes/admin.parametres";
import { AdminUsers } from "@/routes/admin.utilisateurs";
import { AdminStats } from "@/routes/admin.statistiques";
import { LoginPageImpl } from "@/routes/admin.login";

const AdminLogin = LoginPageImpl;

function renderPublicContent(pathname: string): ReactNode {
  switch (pathname) {
    case "/":
      return <Index />;
    case "/a-propos":
      return <AboutPage />;
    case "/catalogue":
      return <CataloguePage />;
    case "/contact":
      return <ContactPage />;
    case "/partenaires":
      return <PartnersPage />;
    case "/tracking":
      return <TrackingPage />;
    default:
      if (pathname.startsWith("/vehicules/")) {
        return <VehiclePage />;
      }
      return <PageNotFound />;
  }
}

function renderAdminContent(pathname: string): ReactNode {
  switch (pathname) {
    case "/admin":
    case "/admin/":
      return <AdminDashboard />;
    case "/admin/catalogue":
      return <AdminCatalogue />;
    case "/admin/conteneurs":
      return <AdminContainers />;
    case "/admin/precommandes":
      return <AdminOrders />;
    case "/admin/parametres":
      return <AdminSettings />;
    case "/admin/utilisateurs":
      return <AdminUsers />;
    case "/admin/statistiques":
      return <AdminStats />;
    default:
      return <PageNotFound />;
  }
}

function AppRoutes() {
  useDocumentBranding();
  const pathname = useRouterState((s) => s.pathname);
  const isAdmin = pathname.startsWith("/admin");

  if (pathname === "/404") {
    return <PageNotFound />;
  }
  if (pathname === "/admin/login") {
    return <AdminLogin />;
  }
  if (isAdmin) {
    return <AdminShell>{renderAdminContent(pathname)}</AdminShell>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <SiteHeader />
      <main className="flex-1">{renderPublicContent(pathname)}</main>
      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}
