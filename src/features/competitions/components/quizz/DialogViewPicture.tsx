"use client";
import React from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import moment from "moment";

import {
  useCommentPictureMutation,
  useGetAllCommentByPictureIdQuery,
  useGetPictureQuery,
} from "../../api.picture";
import { Picture } from "../../type.competitions";

import { StarRating } from "./start-rating";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Citizens, Student } from "@/features/users/user.types";
import { formatDate } from "@/utils/format-date";

const getBadge = (isGraded: boolean) => {
  if (isGraded)
    return (
      <Badge className="text-xs bg-green-500 font-semibold">Đã chấm</Badge>
    );

  return (
    <Badge className="text-xs bg-yellow-400 hover:bg-yellow-500 font-semibold">
      Đang được chấm
    </Badge>
  );
};

const formatDateFromNow = (date: string) => {
  return moment(new Date(date)).startOf("second").fromNow();
};

export type CommentType = {
  _id: string;
  isActive: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  content: string;
  picture_id: string;
  user_id: Student | Citizens;
  created_at: string;
  updated_at: string;
  __v: number;
};

// Get rating color based on score
const getRatingColor = (score: number, max: number) => {
  const percentage = (score / max) * 100;

  if (percentage >= 80) return "text-green-500";
  if (percentage >= 60) return "text-lime-500";
  if (percentage >= 40) return "text-yellow-500";
  if (percentage >= 20) return "text-orange-500";

  return "text-red-500";
};

const formSchema = z.object({
  content: z
    .string({ message: "Không được để trống nội dung" })
    .min(1, "Không được để trống nội dung"),
});

const DialogViewPicture = ({
  id,
  quiz_id,
}: {
  id: string;
  quiz_id: string;
}) => {
  const router = useRouter();
  const { picture, isFetching }: { picture: Picture; isFetching: boolean } =
    useGetPictureQuery(id ? { id } : skipToken, {
      selectFromResult: ({ data, isFetching }) => ({
        picture: data?.data,
        isFetching,
      }),
    });

  const {
    comments,
    isFetchingComment,
  }: { comments: CommentType[]; isFetchingComment: boolean } =
    useGetAllCommentByPictureIdQuery(
      picture?._id ? { id: picture?._id } : skipToken,
      {
        selectFromResult: ({ data, isFetching }) => ({
          comments: data?.data,
          isFetchingComment: isFetching,
        }),
      },
    );

  const handleCloseModal = () => {
    router.replace(`/phan-thi-ve-tranh-co-dong/${quiz_id}`);
  };

  return (
    <Dialog open={!!id} onOpenChange={handleCloseModal}>
      {isFetching ? (
        <DialogContent className="relative flex flex-col md:flex-row h-[80vh] min-w-[80vw] rounded-lg p-0 overflow-hidden border-none">
          <SkeletonDetail />
        </DialogContent>
      ) : (
        <DialogContent className="flex flex-col md:flex-row h-[80vh] min-w-[80vw] rounded-lg p-0 overflow-hidden border-none">
          <div className="md:block hidden h-full w-full">
            <RightSide comments={comments} picture={picture} />
          </div>

          <ScrollArea className="md:hidden block">
            <RightSide comments={comments} picture={picture} />
          </ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
};

const RightSide = ({
  picture,
  comments,
}: {
  picture: Picture;
  comments: CommentType[];
}) => {
  const [comment, { isLoading }] = useCommentPictureMutation();

  const score = picture?.score;
  const maxScore = 10;

  const ratingColor = getRatingColor(score ?? 0, maxScore);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await comment({
        ...values,
        picture_id: picture?._id,
      }).unwrap();
      form.reset({
        content: "",
      });
    } catch (error) {}
  }

  return (
    <div className="flex flex-col h-full w-full md:flex-row">
      <div className="bg-black/20 md:w-1/2 w-full flex items-center justify-center">
        <Image
          key={picture?.id}
          alt={`picture ${picture?.id}`}
          className="max-h-full object-cover"
          height={800}
          src={picture?.picture || "/placeholder.svg"}
          width={800}
        />
      </div>

      <div className="flex flex-1 flex-col border-l">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Link
              className="cursor-pointer"
              href={`/trang-ca-nhan/${picture?.user_id?.username}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage alt="User" src={picture?.user_id?.avatar} />
                <AvatarFallback>{picture?.user_id?.username}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex gap-2 items-center">
                <Link
                  className="font-semibold text-sm hover:underline"
                  href={`/trang-ca-nhan/${picture?.user_id?.username}`}
                >
                  {picture?.user_id?.username}
                </Link>
                {getBadge(picture?.score !== undefined)}
              </div>
              <p className="text-xs text-muted-foreground  capitalize">
                {formatDate(
                  picture?.created_at,
                  "dddd, [Ngày] DD [tháng] MM[,] YYYY",
                )}
              </p>
            </div>
          </div>
          {score !== undefined && (
            <div className="flex mt-3 flex-col space-y-1">
              <div className="flex items-center gap-1">
                <StarRating rating={score ?? 0} />
                <span className={cn("ml-2 font-bold text-lg", ratingColor)}>
                  {score}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{maxScore}
                </span>
              </div>

              <div className="flex items-center">
                <span className={cn("text-sm font-medium", ratingColor)}>
                  Đánh giá: {picture?.feedback}
                </span>
              </div>
            </div>
          )}
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="User"
                  src={picture?.user_id?.avatar ?? "/placeholder.svg"}
                />
                <AvatarFallback>{picture?.user_id?.username}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex-1">
                  <span className="font-semibold text-sm mr-2">
                    {picture?.user_id?.username}
                  </span>
                  <span className="text-sm flex gap-1">
                    <p className="">
                      Tên bức ảnh là{" "}
                      <strong className="text-[#75A815] first-letter:capitalize">
                        {picture?.name}
                      </strong>
                      . {picture?.description}
                    </p>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDateFromNow(picture?.created_at)}
                </p>
              </div>
            </div>

            {comments?.map((comment) => (
              <div key={comment?._id} className="flex items-start w-full gap-2">
                <Link
                  className="cursor-pointer"
                  href={`/trang-ca-nhan/${comment?.user_id?.username}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      alt={comment?.user_id?.username}
                      src={comment?.user_id?.avatar}
                    />
                    <AvatarFallback>
                      {comment?.user_id?.username
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="w-full">
                  <div className="">
                    <Link
                      className="cursor-pointer hover:underline font-semibold text-sm mr-2"
                      href={`/trang-ca-nhan/${comment?.user_id?.username}`}
                    >
                      {comment?.user_id?.username}
                    </Link>
                    <p className="text-sm break-words break-all">
                      {comment?.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDateFromNow(comment?.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-2" />
        </ScrollArea>
        <div className="md:static md:bg-none bg-white dark:bg-background absolute w-full h-20 bottom-0 p-4 border-t">
          <Form {...form}>
            <form
              className="flex items-center gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        className="h-9 bg-transparent  border-none focus-visible:outline-none focus-visible:ring-0"
                        placeholder="Bình luận..."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="text-sm font-semibold text-[#75A815]"
                disabled={!form.getValues("content")}
                isLoading={isLoading}
                variant="ghost"
              >
                Gửi
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export function SkeletonDetail() {
  return (
    <div className="flex flex-col md:flex-row w-full mx-auto border rounded-lg overflow-hidden bg-white">
      {/* Left side - Image skeleton */}
      <div className="md:w-1/2 aspect-square relative">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      {/* Right side - Content */}
      <div className="md:w-1/2 flex flex-col">
        {/* User info and rating */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          {/* Star rating skeleton */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded" />
                ))}
              </div>
              <Skeleton className="h-6 w-12 ml-2" />
            </div>
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </div>

        {/* Caption and comments */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Caption */}
          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>

          {/* Comments - with varying widths for more realistic look */}
          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          <div className="flex items-start gap-2 mb-6">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>

        {/* Comment input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogViewPicture;
