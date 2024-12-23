import { Metadata } from "next";

import DataTable from "../../../components/data-table/data-table";

import { columns } from "./columns";

import { users } from "@/features/users/data";

export const metadata: Metadata = {
  title: "Quản lý người dùng",
};

function Page() {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Quản lý người dùng</h3>
      <DataTable columns={columns} data={users} />
    </div>
  );
}

export default Page;
