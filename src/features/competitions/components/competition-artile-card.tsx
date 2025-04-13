import Image from "next/image";
import { TimerIcon } from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import ActionCompetitions from "../action-join-compeititions";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const getStatus = (status: string) => {
  switch (status) {
    case "Upcoming":
      return (
        <div className="flex items-center text-yellow-500">
          <TimerIcon className="mr-2 h-4 w-4 text-yellow-500" />
          <p className="text-sm">Sắp diễn ra</p>
        </div>
      );
    case "Outgoing":
      return (
        <div className="flex items-center text-red-500">
          <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-sm">Đã kết thúc</p>
        </div>
      );
    case "Ongoing":
      return (
        <div className="flex items-center text-green-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-green-500" />
          <p className="text-sm">Đang diễn ra</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center text-red-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-sm">Đã kết thúc</p>
        </div>
      );
  }
};

export function CompetitionArticleCard({
  title,
  startDate,
  endDate,
  image,
  slug,
  description,
  status,
}: {
  title: string;
  startDate: string;
  endDate: string;
  image?: string | null;
  slug: string;
  description: string;
  status: string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <CardContent className="p-0 relative">
        <Badge className="absolute top-2 right-2 z-10 shadow-md bg-primary/10 dark:bg-primary/20 hover:bg-primary/10 text-primary rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" /> Đang diễn
          ra
        </Badge>
        <div className="relative">
          <Image
            alt={title}
            className="w-full h-48 object-cover"
            height={200}
            src={image || "/placeholder.svg"}
            width={300}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
          <p className=" text-base">{description}</p>

          <div className="flex md:flex-row flex-col gap-2 md:items-center">
            <p className="md:block hidden text-sm">Từ</p>
            <span className="text-gray-500 text-sm">
              <p className="md:hidden block text-sm text-black dark:text-white">
                Từ
              </p>
              {startDate}
            </span>
            <p className="md:block hidden text-sm">Tới</p>
            <span className="text-gray-500 text-sm">
              <p className="md:hidden block text-sm text-black dark:text-white">
                Tới
              </p>
              {endDate}
            </span>
          </div>
          <div className="flex w-full justify-between mt-4">
            {/* <div className="mt-2">{getStatus(status)}</div> */}
            <ActionCompetitions slug={slug} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
