"use client";

import { Users, BookOpen, Newspaper, Building2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

import {
  useGetCountLibraryViewsQuery,
  useGetCountNewsViewsQuery,
  useGetCountOrganizationByProvinceQuery,
  useGetCountOrganizationsQuery,
  useGetCountUsersQuery,
  useGetVisitStats7DaysQuery,
} from "../api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="desc">
          Ngày {format(label, "dd/MM")}: {payload[0].value} lượt
        </p>
      </div>
    );
  }

  return null;
};

const provinceData = [
  { province: "Hà Nội", organizations: 120 },
  { province: "TP.HCM", organizations: 150 },
  { province: "Đà Nẵng", organizations: 80 },
  { province: "Hải Phòng", organizations: 60 },
  { province: "Cần Thơ", organizations: 45 },
  { province: "Huế", organizations: 40 },
  { province: "Nha Trang", organizations: 35 },
];

export function Overview() {
  const { totalUsers } = useGetCountUsersQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          totalUsers: data?.data?.citizens?.total + data?.data?.students?.total,
        };
      },
    }
  );

  const { totalOrganizations } = useGetCountOrganizationsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          totalOrganizations: data?.data,
        };
      },
    }
  );

  const { totalNewsViews } = useGetCountNewsViewsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          totalNewsViews: data?.data,
        };
      },
    }
  );

  const { totalLibraryViews } = useGetCountLibraryViewsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          totalLibraryViews: data?.data,
        };
      },
    }
  );

  const { visitStats7Days } = useGetVisitStats7DaysQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          visitStats7Days: data?.data,
        };
      },
    }
  );

  const { dataOrganizationByProvince } = useGetCountOrganizationByProvinceQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          dataOrganizationByProvince: data?.data?.filter(
            (item: any) => item?.count
          ),
        };
      },
    }
  );

  console.log(
    "🚀 ~ Overview ~ dataOrganizationByProvince:",
    dataOrganizationByProvince
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng số người dùng
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          {/* <p className="text-xs text-muted-foreground">
            +15% so với tháng trước
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng số tổ chức</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrganizations}</div>
          {/* <p className="text-xs text-muted-foreground">
            +5% so với tháng trước
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lượt xem thư viện
          </CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLibraryViews}</div>
          {/* <p className="text-xs text-muted-foreground">
            +8% so với tháng trước
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lượt xem tin tức
          </CardTitle>
          <Newspaper className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNewsViews}</div>
          {/* <p className="text-xs text-muted-foreground">
            +12% so với tháng trước
          </p> */}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Lượt truy cập 7 ngày gần nhất</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <ChartContainer
            className="aspect-[4/2]"
            config={{
              visits: {
                label: "Lượt truy cập",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <AreaChart
              data={visitStats7Days}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(date, "dd/MM")}
              />
              <YAxis dataKey="count" />
              <ChartTooltip content={<CustomTooltip />} />
              <Area
                dataKey="count"
                fill="var(--color-visits)"
                fillOpacity={0.2}
                stroke="var(--color-visits)"
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2 ">
        <CardHeader>
          <CardTitle>Số lượng tổ chức theo tỉnh</CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <ChartContainer
            className="aspect-[4/2]"
            config={{
              organizations: {
                label: "Số tổ chức",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <BarChart
              data={dataOrganizationByProvince}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid
                horizontal={true}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis type="number" />
              <YAxis dataKey="provinceName" type="category" width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-organizations)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
