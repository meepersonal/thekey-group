import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStoreProvider } from "@/data/admin-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminStoreProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AdminStoreProvider>
  );
}
