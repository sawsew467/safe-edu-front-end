"use client";
import React from "react";
import { Label } from "@radix-ui/react-label";

import { useGetLibraryQuery } from "../api";

import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/topic-select";
import UploadImage from "@/components/ui/upload-image";
import { useGetTopicQuery } from "@/features/topic/api";
import CustomEditor from "@/components/ui/custom-editor";

const DescriptionModule = ({ id }: { id: string }) => {
  const { data, isFetching, isSuccess } = useGetLibraryQuery(
    { id },
    {
      selectFromResult: ({ data, isFetching, isSuccess }) => ({
        data: data,
        isFetching,
        isSuccess,
      }),
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: topic } = useGetTopicQuery(
    { id: data?.topic_id },
    { skip: !isSuccess },
  );

  console.log("", topic);

  return (
    <div>
      {isFetching ? (
        <div className="flex gap-2">
          <Spinner />
          <p>đang tải...</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-8">
          <div className="space-y-2">
            <Label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="category_name"
            >
              Tiêu đề
            </Label>
            <Input
              disabled
              className="max-w-sm"
              id="category_name"
              value={data?.category_name}
            />
          </div>

          <div className="space-y-2">
            <Label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="topic"
            >
              Chủ đề
            </Label>
            <Select disabled defaultValue={data?.topic_id}>
              <SelectTrigger className="max-w-sm">
                <SelectValue>{topic?.topic_name}</SelectValue>
              </SelectTrigger>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="topic"
            >
              Icon
            </Label>
            <UploadImage disabled value={data?.image} />
          </div>
          <div className="space-y-2">
            <Label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="topic"
            >
              Mô tả
            </Label>
            <CustomEditor content={data?.description} editable={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionModule;
