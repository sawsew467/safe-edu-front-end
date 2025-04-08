import React from "react";

import TitlePage from "@/components/ui/title-page";
import DataTable from "@/components/data-table/data-table";
import { columns } from "@/app/(dashboard)/cuoc-thi/[id]/columns.contestant";
import { useGetAllStudentsQuery } from "@/features/users/api/student.api";
import { Student } from "@/features/users/user.types";

const ContestantManagement = () => {
  const { students, isFetching } = useGetAllStudentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        students:
          data?.items?.map((item: Student) => ({
            ...item,
            full_name: `${item?.first_name} ${item?.last_name}`,
          })) ?? [],
        isFetching,
      }),
    },
  );

  return (
    <>
      <TitlePage title="Người tham gia cuộc thi" />
      <DataTable columns={columns} data={students} isLoading={isFetching} />
    </>
  );
};

export default ContestantManagement;
