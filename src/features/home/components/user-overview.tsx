import { MyChart } from "./my-chart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const userData = [
  { name: "Học sinh", value: 5000 },
  { name: "Tổ chức", value: 100 },
  { name: "Quản trị viên", value: 20 },
];

export function UserOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Tổng Số Người Dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {userData.reduce((sum, entry) => sum + entry.value, 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Người Dùng Hoạt Động (7 Ngày Qua)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">3.245</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Người Tham Gia Cuộc Thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1.890</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Người Dùng Thư Viện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">2.567</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardContent>
          {/* <ChartContainer className="min-h-[200px] w-full" config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer> */}
          <MyChart />
        </CardContent>
      </Card>
    </div>
  );
}
