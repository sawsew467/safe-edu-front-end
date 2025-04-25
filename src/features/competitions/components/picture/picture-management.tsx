import React from "react";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetAllPictureByQuizIdQuery } from "../../api.picture";

import LeftOption from "./left-option";
import PictureContent from "./picture-content";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const PictureManagement = ({ closeDialog }: { closeDialog: () => void }) => {
  const params = useSearchParams();
  const quiz_id = params.get("id") as string;
  const { pictures, isFetching, isSuccess } = useGetAllPictureByQuizIdQuery(
    quiz_id ? { id: quiz_id } : skipToken,
    {
      selectFromResult: ({ data, isFetching, isSuccess }) => ({
        pictures: data?.data,
        isFetching,
        isSuccess,
      }),
    },
  );

  const [currentPictureIndex, setCurrentPicture] = React.useState(0);

  const currentPicture = pictures?.[currentPictureIndex];

  if (isFetching)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );
  if (isSuccess && pictures?.length === 0)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <p className="text-center text-3xl text-gray-500">
          Chưa có bức tranh nào được gửi lên
        </p>
      </div>
    );

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-6">
        <div className="w-full flex justify-end">
          <Button variant="default" onClick={closeDialog}>
            Kết thúc
          </Button>
        </div>
        <div className="grid gap-4 min-h-[500px]  grid-cols-6">
          <div className="col-span-1 max-h-[80vh]">
            <LeftOption
              currentPicture={currentPictureIndex}
              pictures={pictures}
              setCurrentPicture={setCurrentPicture}
            />
          </div>
          <div className="col-span-5">
            <PictureContent currentPicture={currentPicture} quiz_id={quiz_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PictureManagement;
