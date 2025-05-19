"use client";

import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";

import { useGetOrganizationByIdQuery } from "../organization.api";
import { Organization } from "../types";

import FormEditOrganizations from "./form-edit-new-organizations";
import StudentManagement from "./student-management";
import ManagerManagement from "./manager-management";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useAppSelector } from "@/hooks/redux-toolkit";

function DetailOrgnization() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "";
  const { id: organizationId } = useParams<{ id: string }>();

  const { organization }: { organization: Organization } =
    useGetOrganizationByIdQuery(
      { id: organizationId },
      {
        skip: !organizationId,
        selectFromResult: ({ data }) => {
          return {
            organization: data?.data,
          };
        },
      }
    );

  const { current_organization } = useAppSelector((state) => state.auth);

  useBreadcrumb(
    current_organization
      ? [
          {
            label: `Quản lý tổ chức`,
            href: "/quan-tri/to-chuc",
          },
        ]
      : [
          {
            label: `Quản lý tổ chức`,
            href: "/quan-tri/to-chuc",
          },
          {
            label: organization?.name ?? "",
          },
        ]
  );

  const handleChangeTabs = ({
    target: { id },
  }: {
    target: HTMLButtonElement;
  } & React.MouseEvent<HTMLButtonElement>) => {
    router.replace(`?tab=${id}`);
  };

  return (
    <Tabs defaultValue={tab || "danh-sach-hoc-sinh"}>
      <TabsList>
        <TabsTrigger
          id="danh-sach-hoc-sinh"
          value="danh-sach-hoc-sinh"
          onClick={handleChangeTabs}
        >
          Danh sách học sinh
        </TabsTrigger>
        <TabsTrigger
          id="danh-sach-quan-li-vien"
          value="danh-sach-quan-li-vien"
          onClick={handleChangeTabs}
        >
          Danh sách quản lý
        </TabsTrigger>
        <TabsTrigger id="cai-dat" value="cai-dat" onClick={handleChangeTabs}>
          Cài đặt
        </TabsTrigger>
      </TabsList>
      <div className="p-4 bg-background rounded-md ">
        <TabsContent value="danh-sach-hoc-sinh">
          <StudentManagement />
        </TabsContent>
        <TabsContent value="danh-sach-quan-li-vien">
          <ManagerManagement />
        </TabsContent>
        <TabsContent value="cai-dat">
          <FormEditOrganizations id={organizationId} setOpenDialog={() => {}} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default DetailOrgnization;
