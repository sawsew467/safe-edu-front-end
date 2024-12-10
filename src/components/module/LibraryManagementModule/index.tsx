"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { columns } from "./columns";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/data-table/data-table";
import { library } from "@/features/users/data";

const LibraryManagementModule = () => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Quản lý thư viện</h3>
        <Button
          className="h-8 px-2 lg:px-3"
          variant="outline"
          onClick={() => router.push("thu-vien/them-bai-viet")}
        >
          <PlusIcon className=" h-4 w-4" />

          {"Thêm dữ liệu"}
        </Button>
      </div>
      <DataTable columns={columns} data={library} />
    </div>
  );
};

export default LibraryManagementModule;
