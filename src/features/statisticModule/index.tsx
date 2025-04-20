"use client";
import React from "react";

import { ContestManagement } from "../home/components/contest-management";
import { LibraryStatistics } from "../home/components/library-statistics";
import { OrganizationManagement } from "../home/components/organization-management";
import { UserOverview } from "../home/components/user-overview";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useBreadcrumb from "@/hooks/useBreadcrumb";

export default function StatisticModule() {
  useBreadcrumb([
    {
      label: `Thống kê`,
    },
  ]);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800 h-full">
      <h1 className="text-4xl font-bold mb-10">
        Bảng Điều Khiển Chiến Dịch Phòng Chống Ma Túy
      </h1>
      <Tabs className="space-y-4" defaultValue="user-overview">
        <TabsList>
          <TabsTrigger value="user-overview">Tổng Quan Người Dùng</TabsTrigger>
          <TabsTrigger value="organization-management">
            Quản Lý Tổ Chức
          </TabsTrigger>
          <TabsTrigger value="contest-management">Quản Lý Cuộc Thi</TabsTrigger>
          <TabsTrigger value="library-statistics">
            Thống Kê Thư Viện
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-overview">
          <UserOverview />
        </TabsContent>
        <TabsContent value="organization-management">
          <OrganizationManagement />
        </TabsContent>
        <TabsContent value="contest-management">
          <ContestManagement />
        </TabsContent>
        <TabsContent value="library-statistics">
          <LibraryStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
