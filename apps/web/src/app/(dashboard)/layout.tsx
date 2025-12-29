import { Sidebar } from "@/components/dashboard/sidebar";
import { UserNav } from "@/components/dashboard/user-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-end border-b px-6">
          <UserNav />
        </header>

        {/* Main content with read-only banner if applicable */}
        <DashboardShell>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </DashboardShell>
      </div>
    </div>
  );
}
