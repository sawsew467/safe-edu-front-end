import React from "react";

import FormUpdateNews from "@/features/news/components/form-update-new-news";

const UpdateLibraryPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Thay đổi danh sách</h3>
      <FormUpdateNews />
    </div>
  );
};

export default UpdateLibraryPage;
