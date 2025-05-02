import React from "react";

import { Picture } from "../../type.competitions";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
const LeftOption = ({
  pictures,
  currentPicture,
  setCurrentPicture,
}: {
  pictures: Picture[];
  currentPicture: number;
  setCurrentPicture: (currentPicture: number) => void;
}) => {
  const picture = pictures?.at(currentPicture);

  return (
    <div className="flex h-[80vh] w-full p-2 dark:bg-gray-600 bg-gray-50 rounded-lg ">
      <ScrollArea className="w-full pr-4">
        {pictures?.map((picture, index) => (
          <Button
            key={picture._id}
            className={cn(
              "rounded flex items-center w-full p-2 mb-4 cursor-pointer",
              currentPicture !== index &&
                "dark:bg-gray-700 bg-gray-300 hover:bg-gray-400",
            )}
            variant={currentPicture === index ? "outline" :  "secondary"}
            onClick={() => setCurrentPicture(index)}
          >
            {picture?.score === undefined
              ? `Tranh ${index + 1}`
              : "Tranh đã có điểm"}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default LeftOption;
