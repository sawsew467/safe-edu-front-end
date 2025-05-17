"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllLibraryQuery } from "@/features/library/api";
import { useGetAllNewsQuery } from "@/features/news/api";
import { useGetAllTopicQuery } from "@/features/topic/api";

const topicData = [
  { name: "Chủ đề 1", value: 45 },
  { name: "Chủ đề 2", value: 30 },
  { name: "Chủ đề 3", value: 25 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export function Content() {
  const [showAllLibrary, setShowAllLibrary] = useState(false);
  const [showAllNews, setShowAllNews] = useState(false);

  const { libraryArticles } = useGetAllLibraryQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          libraryArticles: data?.data?.items?.filter(
            (item: any) => item?.isActive
          ),
        };
      },
    }
  );

  const { newsArticles } = useGetAllNewsQuery(
    {},
    {
      selectFromResult({ data }) {
        return {
          newsArticles: data?.data?.items?.filter(
            (item: any) => item?.isActive
          ),
        };
      },
    }
  );

  const { topicsRawData } = useGetAllTopicQuery(
    {},
    {
      selectFromResult({ data }) {
        console.log("🚀 ~ selectFromResult ~ data:", data);

        return {
          topicsRawData: data?.data?.data?.filter(
            (item: any) => item?.isActive
          ),
        };
      },
    }
  );

  console.log("🚀 ~ Content ~ topicData:", topicsRawData);

  const displayedLibraryArticles = showAllLibrary
    ? libraryArticles
    : libraryArticles?.slice(0, 5);

  const displayedNewsArticles = showAllNews
    ? newsArticles
    : newsArticles?.slice(0, 5);

  const topicData = [
    { name: topicsRawData?.[0]?.topic_name, value: 45 },
    { name: topicsRawData?.[1]?.topic_name, value: 30 },
    { name: topicsRawData?.[2]?.topic_name, value: 25 },
  ];

  const topicActivityData = [
    {
      month: "T1",
      "Ma Túy": 45,
      "Bạo Lực Học Đường": 30,
      "Bình Đẳng Giới": 25,
    },
    {
      month: "T2",
      "Ma Túy": 50,
      "Bạo Lực Học Đường": 35,
      "Bình Đẳng Giới": 28,
    },
    {
      month: "T3",
      "Ma Túy": 48,
      "Bạo Lực Học Đường": 40,
      "Bình Đẳng Giới": 32,
    },
    {
      month: "T4",
      "Ma Túy": 55,
      "Bạo Lực Học Đường": 45,
      "Bình Đẳng Giới": 35,
    },
    {
      month: "T5",
      "Ma Túy": 60,
      "Bạo Lực Học Đường": 50,
      "Bình Đẳng Giới": 40,
    },
    {
      month: "T6",
      "Ma Túy": 65,
      "Bạo Lực Học Đường": 55,
      "Bình Đẳng Giới": 45,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Lượt xem bài viết thư viện</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead className="text-right">Lượt xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLibraryArticles?.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    {article.category_name}
                  </TableCell>
                  <TableCell className="text-right min-w-20">
                    {article.view}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {libraryArticles && libraryArticles.length > 5 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAllLibrary(!showAllLibrary)}
              >
                {showAllLibrary ? "Thu gọn" : "Xem thêm"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Lượt xem bài viết tin tức</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead className="text-right">Lượt xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedNewsArticles?.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell className="text-right min-w-20">
                    {article.view}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {newsArticles && newsArticles.length > 5 && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAllNews(!showAllNews)}
              >
                {showAllNews ? "Thu gọn" : "Xem thêm"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Tỉ lệ theo dõi chủ đề</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px]"
            config={{
              maTuy: {
                label: "Ma Túy",
                color: COLORS[0],
              },
              baoLucHocDuong: {
                label: "Bạo Lực Học Đường",
                color: COLORS[1],
              },
              binhDangGioi: {
                label: "Bình Đẳng Giới",
                color: COLORS[2],
              },
            }}
          >
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={topicData}
                dataKey="value"
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                outerRadius={100}
              >
                {topicData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-2 md:col-span-1">
        <CardHeader>
          <CardTitle>Tương tác chủ đề theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="h-[300px]"
            config={{
              maTuy: {
                label: "Ma Túy",
                color: COLORS[0],
              },
              baoLucHocDuong: {
                label: "Bạo Lực Học Đường",
                color: COLORS[1],
              },
              binhDangGioi: {
                label: "Bình Đẳng Giới",
                color: COLORS[2],
              },
            }}
          >
            <BarChart
              data={topicActivityData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="Ma Túy" fill={COLORS[0]} />
              <Bar dataKey="Bạo Lực Học Đường" fill={COLORS[1]} />
              <Bar dataKey="Bình Đẳng Giới" fill={COLORS[2]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
