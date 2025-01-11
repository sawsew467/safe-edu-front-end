"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import AdminManagement from "./admin/admin-management";
import SuperVisionManagement from "./supervision/supervision-management";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";

const UserManagementModule = () => {
  const params = useSearchParams();
  const tab = params.get("tab") ?? "admin";

  return (
    <>
      <Tabs defaultValue={tab}>
        <TabsList className="flex justify-start rounded-none overflow-hidden">
          <TabsTrigger value="admin">Quản trị viên</TabsTrigger>
          <TabsTrigger value="admin">Quản trị viên</TabsTrigger>
          <TabsTrigger value="manager">Quan lí</TabsTrigger>
          <TabsTrigger value="user">học sinh & phụ huynh</TabsTrigger>
        </TabsList>
        <div className="p-4 bg-background rounded-md">
          <TabsContent value="admin">
            <AdminManagement />
          </TabsContent>
          <TabsContent value="supervision">
            <SuperVisionManagement />
          </TabsContent>
          <TabsContent value="user" />
        </div>
      </Tabs>
    </>
  );
};

export default UserManagementModule;
