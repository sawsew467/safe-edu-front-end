import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import constants from "@/settings/constants";

// Force dynamic rendering for all dashboard pages
export const dynamic = "force-dynamic";

async function Layout({ children }: { children: React.ReactNode }) {
  const cookiesStore = await cookies();
  const access_token = cookiesStore.get(constants.ACCESS_TOKEN_ADMIN)?.value;

  if (!access_token) redirect("/quan-tri/dang-nhap");

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
