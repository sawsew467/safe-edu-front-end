"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";

import {
  useGetAllPictureByQuizIdQuery,
  useGetMyPictureQuery,
} from "../../api.picture";
import { useGetQuizzQuery, useIsDoQuizzQuery } from "../../api.quizz";
import { Picture } from "../../type.competitions";

import UploadMyPicture from "./UploadMyPicture";
import DialogViewPicture from "./DialogViewPicture";
import DialogViewScore from "./DialogViewScore";

import { Button } from "@/components/ui/button";
import { deleteClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { Skeleton } from "@/components/ui/skeleton";

const PaintingPropagandaModule = () => {
  const router = useRouter();
  const [isOpenUploadNewPicture, setOpenUploadNewPicture] =
    React.useState(false);
  const { id: quiz_id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const picture_id = params.get("id");
  const action = params.get("action");
  const isViewPicture = !!picture_id && !action;
  const isViewScore = !!picture_id && action === "xem-diem";
  const {
    data,
    isFetching,
    isSuccess,
  }: { data: Picture[]; isFetching: boolean; isSuccess: boolean } =
    useGetAllPictureByQuizIdQuery(quiz_id ? { id: quiz_id } : skipToken, {
      selectFromResult: ({ data, isFetching, isSuccess }) => ({
        data:
          data?.data
            ?.filter((item: Picture) => item?.isActive)
            .sort(
              (a: Picture, b: Picture) =>
                new Date(a?.created_at) > new Date(b?.created_at),
            ) ?? [],
        isFetching,
        isSuccess,
      }),
    });

  const { quiz } = useGetQuizzQuery(quiz_id ? { id: quiz_id } : skipToken, {
    selectFromResult: ({ data, isFetching }) => ({
      quiz: data?.data,
      isFetching,
    }),
  });

  const { isSubmited } = useIsDoQuizzQuery(
    quiz_id ? { id: quiz_id } : skipToken,
    {
      selectFromResult: ({ data }) => ({
        isSubmited: data?.data?.isSubmit,
      }),
    },
  );

  const { myPicture }: { myPicture: Picture } = useGetMyPictureQuery(
    isSubmited ? { id: quiz_id } : skipToken,
    {
      selectFromResult: ({ data }) => ({
        myPicture: data?.data,
      }),
    },
  );

  return (
    <div className="p-4">
      <UploadMyPicture
        isOpen={isOpenUploadNewPicture}
        quiz_id={quiz_id}
        setOpen={setOpenUploadNewPicture}
      />
      <DialogViewPicture
        id={picture_id!}
        open={isViewPicture}
        quiz_id={quiz_id!}
      />
      <DialogViewScore open={isViewScore} quiz_id={quiz_id!} />
      <div className="relative">
        <h2 className="lg:text-3xl md:text-2xl text-xl mx-32 font-bold text-primary text-center">
          Tranh vẽ {quiz?.title}
        </h2>
        <div className="absolute top-0 right-4">
          {isSubmited === false ? (
            <Button
              onClick={() => {
                if (isSubmited === false) setOpenUploadNewPicture(true);
                else if (isSubmited === undefined) {
                  deleteClientCookie(constants.ACCESS_TOKEN);
                  deleteClientCookie(constants.REFRESH_TOKEN);
                  deleteClientCookie(constants.USER_INFO);
                }
              }}
            >
              Nộp tranh
            </Button>
          ) : (
            isSubmited === true && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.replace(`?id=${myPicture?._id}&action=xem-diem`);
                  }}
                >
                  Xem điểm của bài thi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.replace(`?id=${myPicture?._id}`);
                  }}
                >
                  Xem bài thi của mình
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <div className="mt-4">
        {isFetching ? (
          <PictureSkeleton />
        ) : data?.length === 0 && isSuccess ? (
          <div className="h-96 flex justify-center items-center">
            <h3 className="text-center text-2xl font-bold mt-10 text-gray-500">
              Chưa có bài làm nào
            </h3>
          </div>
        ) : (
          <div className="lg:columns-4 md:columns-3 columns-2">
            {data?.map((picture: Picture) => (
              <div
                key={picture._id}
                className="mb-4 rounded-lg overflow-hidden"
              >
                <Link replace href={`?id=${picture?._id}`}>
                  <div className="bg-black/20">
                    <Image
                      key={picture._id}
                      alt={`Tranh ${picture?.name}`}
                      height={400}
                      loading="lazy"
                      src={picture?.picture ?? "/placeholder.svg"}
                      width={400}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PictureSkeleton = () => (
  <div className="p-4">
    {/* First collage section */}
    <div
      className="grid grid-cols-12 grid-rows-2 gap-2 mb-4"
      style={{ height: "400px" }}
    >
      <Skeleton className="col-span-5 row-span-2 rounded-lg" />
      <Skeleton className="col-span-3 row-span-1 rounded-lg" />
      <Skeleton className="col-span-4 row-span-1 rounded-lg" />
      <Skeleton className="col-span-7 row-span-1 rounded-lg" />
    </div>

    {/* Second collage section */}
    <div
      className="grid grid-cols-12 grid-rows-2 gap-2 mb-4"
      style={{ height: "350px" }}
    >
      <Skeleton className="col-span-4 row-span-1 rounded-lg" />
      <Skeleton className="col-span-8 row-span-1 rounded-lg" />
      <Skeleton className="col-span-6 row-span-1 rounded-lg" />
      <Skeleton className="col-span-6 row-span-1 rounded-lg" />
    </div>

    {/* Third collage section */}
    <div
      className="grid grid-cols-12 grid-rows-3 gap-2 mb-4"
      style={{ height: "500px" }}
    >
      <Skeleton className="col-span-6 row-span-2 rounded-lg" />
      <Skeleton className="col-span-6 row-span-1 rounded-lg" />
      <Skeleton className="col-span-3 row-span-1 rounded-lg" />
      <Skeleton className="col-span-3 row-span-1 rounded-lg" />
      <Skeleton className="col-span-12 row-span-1 rounded-lg" />
    </div>
  </div>
);

export default PaintingPropagandaModule;
