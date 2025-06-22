import React from "react";

import DocumentsTable from "@/features/documents/components/document-table";
import AddDocumentModal from "@/features/documents/components/add-document-modal";

const DocumentManagementPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      {/* <TitlePage
        contentHref="Thêm tài liệu mới"
        href="tai-lieu/them-tai-lieu"
        title="Quản lí tài liệu"
      /> */}
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Quản lí tài liệu</h3>
        <AddDocumentModal />
      </div>
      <DocumentsTable />
    </div>
  );
};

export default DocumentManagementPage;
