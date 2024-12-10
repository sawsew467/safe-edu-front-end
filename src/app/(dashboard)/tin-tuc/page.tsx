import React from "react";

import { columns } from "./columns";

import TitlePage from "@/components/ui/title-page";
import DataTable from "@/components/data-table/data-table";
import { News } from "@/features/news/data";

const NewsPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        contentHref="Thêm bài báo"
        href="tin-tuc/them-tin-tuc"
        title="Quản lí tin tức"
      />
      <DataTable columns={columns} data={News} />
    </div>
  );
};

export default NewsPage;
