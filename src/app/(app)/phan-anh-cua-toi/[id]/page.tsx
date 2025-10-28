import { MyReportDetail } from "@/features/report";

export const metadata = {
  title: "Chi tiết phản ánh - SafeEdu",
  description: "Xem chi tiết phản ánh bạo lực học đường",
};

export default async function MyReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen ">
      <section className="container space-y-10 mx-auto p-4 rounded-lg ">
        <MyReportDetail reportId={id} />
      </section>
    </div>
  );
}
