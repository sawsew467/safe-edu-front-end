import React from "react";

import FormUpdateLibrary from "@/features/library/components/form-update-new-library";

const UpdateLibraryPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Thay đổi danh sách</h3>
      <FormUpdateLibrary id={id} />
    </div>
  );
};

export default UpdateLibraryPage;
