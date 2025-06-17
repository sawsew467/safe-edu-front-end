"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

import {
  useGetCompetitionMonthlyStatsQuery,
  useGetQuizResultMonthlyStatsQuery,
} from "../api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock data for demonstration
const competitionData = [
  { month: "T1", competitions: 5, participants: 120 },
  { month: "T2", competitions: 7, participants: 180 },
  { month: "T3", competitions: 10, participants: 250 },
  { month: "T4", competitions: 8, participants: 200 },
  { month: "T5", competitions: 12, participants: 300 },
  { month: "T6", competitions: 15, participants: 350 },
  { month: "T7", competitions: 10, participants: 280 },
  { month: "T8", competitions: 8, participants: 220 },
  { month: "T9", competitions: 12, participants: 310 },
  { month: "T10", competitions: 14, participants: 330 },
  { month: "T11", competitions: 16, participants: 380 },
  { month: "T12", competitions: 18, participants: 420 },
];

export function Competition() {
  const { competitionData } = useGetCompetitionMonthlyStatsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          competitionData: data?.data?.data?.map((item: any) => {
            return {
              count: item?.count,
              date: `${item?.year}-${item?.month}`,
            };
          }),
        };
      },
    },
  );

  const { quizResultData } = useGetQuizResultMonthlyStatsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          quizResultData: data?.data,
        };
      },
    },
  );

  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê số cuộc thi theo 12 tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/2]"
            config={{
              competitions: {
                label: "Số cuộc thi",
                color: "hsl(var(--chart-3))",
              },
            }}
          >
            <BarChart
              data={competitionData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(date, "MM/yyyy")}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-competitions)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Thống kê số người tham gia thi theo 12 tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-[4/2]"
            config={{
              participants: {
                label: "Số người tham gia",
                color: "hsl(var(--chart-4))",
              },
            }}
          >
            <LineChart
              data={quizResultData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickFormatter={(date) => format(date, "MM/yyyy")}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                activeDot={{ r: 6 }}
                dataKey="count"
                dot={{ r: 4 }}
                stroke="var(--color-participants)"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
