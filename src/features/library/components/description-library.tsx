"use client";
import React from "react";

import { useGetLibraryQuery } from "../api";

import { Spinner } from "@/components/ui/spinner";

const DescriptionModule = ({ id }: { id: string }) => {
  const { content, isLoading } = useGetLibraryQuery(
    { id },
    {
      selectFromResult: ({ data, isLoading }) => ({
        content: data?.description,
        isLoading,
      }),
    },
  );

  return (
    <div className="bg-background h-full p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      {isLoading ? (
        <div className="flex gap-2">
          <Spinner />
          <p>đang tải...</p>
        </div>
      ) : (
        <span dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
};

export default DescriptionModule;
