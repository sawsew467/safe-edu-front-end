"use client";
import React from "react";

import { useGetAllOrganizationQuery } from "../organization.api";
import { Organization } from "../types";

import FormAddNewOrganizations from "./form-add-new-organizations";

import CardList from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { columns } from "@/app/quan-tri/(dashboard)/to-chuc/column.organizations";
import useBreadcrumb from "@/hooks/useBreadcrumb";

const OrganizationsManagement = () => {
  useBreadcrumb([
    {
      label: `Quản lý tổ chức`,
    },
  ]);

  const [isopen, setOpenDialog] = React.useState(false);
  const [isopenNotification, setOpenDialogNotification] = React.useState(true);
  const { organizations, isFetching } = useGetAllOrganizationQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      organizations:
        data?.data?.items?.map((item: Organization) => ({
          ...item,
          province_name: item?.province_id?.name,
          status: item?.isActive ? "Hoạt động" : "Tạm dừng",
        })) ?? [],
      isFetching,
    }),
  });

  return (
    <>
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Quản lý tổ chức</h3>
        <Dialog
          open={isopenNotification}
          onOpenChange={setOpenDialogNotification}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thông Báo</DialogTitle>
            </DialogHeader>
            <p className="text-gray-700">
              Tính năng này đang được phát triển. Các thông tin hiển thị hiện
              tại chỉ là giả lập.
            </p>
          </DialogContent>
        </Dialog>
        <Dialog open={isopen} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild className="w-fit h-fit">
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => setOpenDialog(true)}
            >
              Thêm tổ chức
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Thêm tổ chức</DialogTitle>
            <FormAddNewOrganizations setOpenDialog={setOpenDialog} />
          </DialogContent>
        </Dialog>
      </div>
      <CardList columns={columns} data={organizations} isLoading={isFetching} />
    </>
  );
};

export default OrganizationsManagement;
