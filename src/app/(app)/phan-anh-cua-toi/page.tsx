import { MyReportsList } from "@/features/report";

export const metadata = {
  title: "Phản ánh của tôi - SafeEdu",
  description: "Quản lý và theo dõi các phản ánh bạo lực học đường của bạn",
};

export default function MyReportsPage() {
  return (
    <div className="min-h-screen ">
      <section className="container space-y-10 mx-auto p-4 rounded-lg ">
        <MyReportsList />
      </section>
    </div>
  );
}
