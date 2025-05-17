"use client";
import React, { useState } from "react";

import { Overview } from "./overview";
import { Content } from "./content";
import { Competition } from "./competition";
import { PeakActivity } from "./peak-activity";

import useBreadcrumb from "@/hooks/useBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Statistic() {
  useBreadcrumb([
    {
      label: `Thống kê`,
    },
  ]);

  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800 h-full">
      <h1 className="text-4xl font-bold mb-10">
        Bảng Điều Khiển Chiến Dịch Phòng Chống Ma Túy
      </h1>
      <Tabs
        className="space-y-4"
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="competition">Cuộc thi</TabsTrigger>
          <TabsTrigger value="peak-activity">Hoạt động tỉnh</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-4" value="overview">
          <Overview />
        </TabsContent>
        <TabsContent className="space-y-4" value="content">
          <Content />
        </TabsContent>
        <TabsContent className="space-y-4" value="competition">
          <Competition />
        </TabsContent>
        <TabsContent className="space-y-4" value="peak-activity">
          <PeakActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
}
