import React from "react";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

import { useGetAllPictureByQuizIdQuery } from "../../api.picture";

import LeftOption from "./left-option";
import PictureContent from "./picture-content";

import { Button } from "@/components/ui/button";

const PictureManagement = ({ closeDialog }: { closeDialog: () => void }) => {
  const params = useSearchParams();
  const quiz_id = params.get("id") as string;
  const { pictures } = useGetAllPictureByQuizIdQuery(
    quiz_id ? { id: quiz_id } : skipToken,
    {
      selectFromResult: ({ data }) => ({
        pictures: data?.data,
      }),
    },
  );

  const [currentPictureIndex, setCurrentPicture] = React.useState(0);

  const currentPicture = pictures?.[currentPictureIndex];

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
