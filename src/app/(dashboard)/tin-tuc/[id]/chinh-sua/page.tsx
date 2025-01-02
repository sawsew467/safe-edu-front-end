import React, { use } from "react";

import FormUpdateNews from "@/features/news/components/form-update-new-news";

const UpdateLibraryPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <FormUpdateNews id={id} />
    </div>
  );
};

export default UpdateLibraryPage;
