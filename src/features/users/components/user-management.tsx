import React from "react";

import AdminManagement from "./admin-management";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";

const UserManagementModule = () => {
  return (
    <>
      <Tabs defaultValue="admin">
        <TabsList className="flex justify-start rounded-none">
          <TabsTrigger value="admin">Quản trị viên</TabsTrigger>
          <TabsTrigger value="supervision">Quản lí</TabsTrigger>
          <TabsTrigger value="user">học sinh & phụ huynh</TabsTrigger>
        </TabsList>
        <div className="p-4 bg-background rounded-md">
          <TabsContent value="admin">
            <AdminManagement />
          </TabsContent>
          <TabsContent value="supervision" />
          <TabsContent value="user" />
        </div>
      </Tabs>
    </>
  );
};

export default UserManagementModule;
