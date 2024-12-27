import { Metadata } from "next";
import React from "react";

import DescriptionModule from "@/features/library/components/description-library";
export const metadata: Metadata = {
  title: "Mô tả bài viết thư viện",
};
const DescPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Mô tả danh sách</h3>
      <DescriptionModule id={id} />
    </div>
  );
};

export default DescPage;
