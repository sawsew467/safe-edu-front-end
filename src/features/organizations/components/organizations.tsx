"use client";
import React, { useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { Loader2 } from "lucide-react";

import { useGetAllOrganizationQuery } from "../organization.api";
import { Organization } from "../types";

import FormAddNewOrganizations from "./form-add-new-organizations";

import CardList from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { columns } from "@/app/quan-tri/(dashboard)/to-chuc/column.organizations";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useAppSelector } from "@/hooks/redux-toolkit";

const OrganizationsManagement = () => {
  useBreadcrumb([
    {
      label: `Quản lý tổ chức`,
    },
  ]);

  const { current_organization } = useAppSelector((state) => state.auth);

  const router = useRouter();

  const [isopen, setOpenDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (current_organization) {
      router.push(`/quan-tri/to-chuc/${current_organization.id}`);
    }
    setIsLoading(false);
  }, [current_organization]);

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

  if (isLoading || current_organization) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Quản lý tổ chức</h3>
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
