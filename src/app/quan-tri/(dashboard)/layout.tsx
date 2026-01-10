import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

// Force dynamic rendering for all dashboard pages
export const dynamic = "force-dynamic";

function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
