import { Metadata } from "next";
import React, { use } from "react";

import DescriptionNewsModule from "@/features/news/components/description-news";
export const metadata: Metadata = {
  title: "Mô tả bài viết thư viện",
};
const DescPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <DescriptionNewsModule id={id} />
    </div>
  );
};

export default DescPage;
