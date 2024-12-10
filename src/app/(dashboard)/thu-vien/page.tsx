import { Metadata } from "next";
import React from "react";

import { columns } from "./columns";

import DataTable from "@/components/data-table/data-table";
import { library } from "@/features/users/data";
import TitleLibrary from "@/components/ui/title-library";

export const metadata: Metadata = {
  title: "Quản Lí Thư Viện",
};
const Library = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitleLibrary
        contentHref="Thêm danh sách"
        href="thu-vien/them-bai-viet"
        title="Quản lí thư viện"
      />
      <DataTable columns={columns} data={library} />
    </div>
  );
};

export default Library;
