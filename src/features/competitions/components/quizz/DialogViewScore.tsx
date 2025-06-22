"use client";
import Image from "next/image";
import { skipToken } from "@reduxjs/toolkit/query";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";

import { useGetMyPictureQuery } from "../../api.picture";
import { Picture } from "../../type.competitions";

import { StarRating } from "./start-rating";

import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";

const maxRating = 10;

export default function DialogViewScore({
  quiz_id,
  open,
}: {
  quiz_id: string;
  open: boolean;
}) {
  const router = useRouter();
  const { myPicture }: { myPicture: Picture } = useGetMyPictureQuery(
    open ? { id: quiz_id } : skipToken,
    {
      selectFromResult: ({ data }) => ({
        myPicture: data?.data,
      }),
    },
  );

  const getRatingColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;

    if (percentage >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (percentage >= 60) return "bg-lime-100 text-lime-700 border-lime-200";
    if (percentage >= 40)
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (percentage >= 20)
      return "bg-orange-100 text-orange-700 border-orange-200";

    return "bg-red-100 text-red-700 border-red-200";
  };

  // Get rating text based on percentage if not provided
  const getRatingText = (score: number, max: number) => {
    const percentage = (score / max) * 100;

    if (percentage >= 80) return "Tuyệt vời";
    if (percentage >= 60) return "Tốt";
    if (percentage >= 40) return "Bình thường";
    if (percentage >= 20) return "Hãy cố gắng thêm";

    return "Hãy cố gắng thêm";
  };

  const handleCloseModal = () => {
    router.replace(`/phan-thi-ve-tranh-co-dong/${quiz_id}`);
  };

  const ratingColor = getRatingColor(myPicture?.score ?? 0, maxRating);
  const ratingText = getRatingText(myPicture?.score ?? 0, maxRating);

  // Default feedback text if none provided

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="flex flex-col  md:flex-row h-[90vh] md:h-[80vh]">
          <div className="md:w-1/2 bg-black/20 flex items-center justify-center relative">
            <Image
              alt="Feedback image"
              className="max-h-full max-w-full object-contain"
              height={800}
              src={myPicture?.picture || "/placeholder.svg"}
              unoptimized={true}
              width={800}
            />
          </div>

          {/* Right side - Feedback content */}
          <div className="md:w-1/2 justify-between h-full flex flex-col bg-white dark:bg-background">
            {/* User info and rating section */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-4 mb-6">
                <Link href={`/trang-ca-nhan/${myPicture?.user_id?.username}`}>
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage
                      alt={myPicture?.user_id?.username}
                      src={
                        myPicture?.user_id?.avatar ??
                        "/placeholder.svg?height=48&width=48"
                      }
                    />
                    <AvatarFallback>
                      {myPicture?.user_id?.username
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      className="font-medium text-base hover:underline"
                      href={`/trang-ca-nhan/${myPicture?.user_id?.username}`}
                    >
                      {myPicture?.user_id?.first_name}{" "}
                      {myPicture?.user_id?.last_name}
                    </Link>
                    {myPicture?.score !== undefined ? (
                      <Badge
                        className="bg-green-500 text-white border-0 text-xs py-1"
                        variant="outline"
                      >
                        Đã chấm
                      </Badge>
                    ) : (
                      <Badge
                        className="bg-yellow-500 text-white border-0 text-xs py-1"
                        variant="outline"
                      >
                        Đang được chấm
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground ">
                    {myPicture?.completedAt
                      ? `Được chấm vào: ${formatDate(myPicture?.completedAt)}`
                      : `Đã nộp vào: ${formatDate(myPicture?.startedAt)}`}
                  </p>
                </div>
              </div>

              {myPicture?.score !== undefined && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">
                        {myPicture?.score?.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        / {maxRating}
                      </span>
                    </div>
                    <Badge className={cn("py-1 px-4 text-sm", ratingColor)}>
                      Đánh giá: {ratingText}
                    </Badge>
                  </div>

                  <div>
                    <StarRating
                      maxRating={maxRating}
                      rating={myPicture?.score ?? 0}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Feedback content with scroll area */}
            {myPicture?.feedback && (
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Đánh giá</h3>
                  <div className="space-y-4">
                    {myPicture?.feedback?.split("\n\n").map((paragraph, i) => (
                      <p
                        key={i}
                        className="text-base leading-relaxed text-gray-700 dark:text-gray-300"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}

            {/* Footer */}
            <DialogFooter className="p-6 border-t">
              <Button variant="outline" onClick={handleCloseModal}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
