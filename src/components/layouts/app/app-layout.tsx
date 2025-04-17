import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AppFooter from "./footer";
import AppHeader from "./header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesStore = await cookies();
  const access_token = cookiesStore.get("_access_token")?.value;

  if (!access_token) redirect("/dang-nhap");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
