"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { useGetAllOrganizationQuery } from "../organization.api";
import { Organization } from "../types";

import { columns } from "@/app/(dashboard)/to-chuc/column.organizations";
import CardList from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";

const OrganizationsManagement = () => {
  const router = useRouter();
  const { organizations, isFetching } = useGetAllOrganizationQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      organizations:
        data?.items?.map((item: Organization) => ({
          ...item,
          province_name: item?.province_id?.at(0)?.name,
        })) ?? [],
      isFetching,
    }),
  });

  return (
    <>
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Quản lý tổ chức</h3>
        <Button
          className="ml-auto "
          variant="outline"
          onClick={() => router.push("to-chuc/them-to-chuc")}
        >
          Thêm tổ chức
        </Button>
      </div>
      <CardList columns={columns} data={organizations} isLoading={isFetching} />
    </>
  );
};

export default OrganizationsManagement;
