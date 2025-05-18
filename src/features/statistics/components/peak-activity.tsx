"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useGetProvinceStatsQuery } from "../api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function PeakActivity() {
  const { provinceStats } = useGetProvinceStatsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          provinceStats: data?.data?.filter((item: any) => item?.visit_count),
        };
      },
    }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ số lượt truy cập ở các tỉnh</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-[4/2]"
          config={{
            visits: {
              label: "Lượt truy cập",
              color: "hsl(var(--chart-5))",
            },
          }}
        >
          <BarChart
            data={provinceStats}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid
              horizontal={true}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="visit_count" fill="var(--color-visits)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
