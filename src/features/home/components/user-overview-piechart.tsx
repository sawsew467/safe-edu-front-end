"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart";

const userData = [
  { name: "Học sinh", value: 500, fill: "var(--color-student)" },
  { name: "Tổ chức", value: 100, fill: "var(--color-organization)" },
  { name: "Quản trị viên", value: 20, fill: "var(--color-admin)" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  student: {
    label: "Học sinh",
    color: "hsl(var(--chart-1))",
  },
  organization: {
    label: "Tổ chức",
    color: "hsl(var(--chart-2))",
  },
  admin: {
    label: "Quản trị viên",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function UserOverviewPieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân Bố Người Dùng</CardTitle>
        <CardDescription>
          Phân bố phần trăm người dùng theo vai trò
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[300px]"
          config={chartConfig}
        >
          <PieChart>
            <Pie data={userData} dataKey="value" />
            <ChartLegend className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
