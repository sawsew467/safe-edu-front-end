"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";

import AdminManagement from "./admin/admin-management";
import StudentManagement from "./student/student-management";
import CitizenManagement from "./citizen/citizen-management";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import { UserRole } from "@/settings/enums";
import useBreadcrumb from "@/hooks/useBreadcrumb";

const UserManagementModule = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "";

  useBreadcrumb([
    {
      label: `${tab in UserRole ? UserRole[tab as keyof typeof UserRole] : UserRole["admin"]}`,
    },
  ]);

  const handleChangeTabs = ({
    target: { id },
  }: {
    target: HTMLButtonElement;
  } & React.MouseEvent<HTMLButtonElement>) => {
    router.replace(`?tab=${id}`);
  };

  return (
    <>
      <Tabs value={tab in UserRole ? tab : "admin"}>
        <TabsList className="flex justify-start rounded-none overflow-hidden">
          <TabsTrigger id="admin" value="admin" onClick={handleChangeTabs}>
            Quản trị viên
          </TabsTrigger>
          {/* <TabsTrigger
            id="supervision"
            value="supervision"
            onClick={handleChangeTabs}
          >
            Quan sát viên
          </TabsTrigger> */}
          {/* <TabsTrigger id="manager" value="manager" onClick={handleChangeTabs}>
            Quản lí viên
          </TabsTrigger> */}
          <TabsTrigger id="student" value="student" onClick={handleChangeTabs}>
            Học sinh
          </TabsTrigger>
          <TabsTrigger id="citizen" value="citizen" onClick={handleChangeTabs}>
            Công dân
          </TabsTrigger>
        </TabsList>
        <div className="p-4 bg-background rounded-md">
          <TabsContent value="admin">
            <AdminManagement />
          </TabsContent>
          {/* <TabsContent value="supervision">
            <SuperVisionManagement />
          </TabsContent> */}
          {/* <TabsContent value="manager">
            <ManagerManagement />
          </TabsContent> */}
          <TabsContent value="student">
            <StudentManagement />
          </TabsContent>
          <TabsContent value="citizen">
            <CitizenManagement />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default UserManagementModule;
