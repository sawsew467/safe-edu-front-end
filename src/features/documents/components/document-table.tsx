"use client";
import React from "react";

import { useGetAllDocumentsQuery } from "../api";
import { Document } from "../type";

import DataTable from "@/components/data-table/data-table";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { columns } from "@/app/quan-tri/(dashboard)/tai-lieu/columns";

const DocumentsTable = () => {
  const { documents, isFetching } = useGetAllDocumentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          documents:
            data?.data?.filter((item: Document) => item.isActive) ?? [],
          isFetching,
        };
      },
      refetchOnMountOrArgChange: true,
    }
  );

  console.log("🚀 ~ DocumentsTable ~ documents:", documents);

  useBreadcrumb([{ label: "Tài liệu" }]);

  return (
    <DataTable columns={columns} data={documents} isLoading={isFetching} />
  );
};

export default DocumentsTable;
