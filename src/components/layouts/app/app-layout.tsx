import AppFooter from "./footer";
import AppHeader from "./header";
import VisitStatic from "@/features/statistics/components/visit-static";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
      <VisitStatic />
    </div>
  );
}
