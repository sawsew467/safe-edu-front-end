"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";

import { useGetAllPictureByQuizIdQuery } from "../../api.picture";
import { useGetQuizzQuery, useIsDoQuizzQuery } from "../../api.quizz";
import { Picture } from "../../type.competitions";

import UploadMyPicture from "./UploadMyPicture";
import DialogViewPicture from "./DialogViewPicture";

import { Button } from "@/components/ui/button";
import { deleteClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const PaintingPropagandaModule = () => {
  const router = useRouter();
  const [isOpenUploadNewPicture, setOpenUploadNewPicture] =
    React.useState(false);
  const { id: quiz_id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const picture_id = params.get("id");
  const { data, isFetching }: { data: Picture[]; isFetching: boolean } =
    useGetAllPictureByQuizIdQuery(quiz_id ? { id: quiz_id } : skipToken, {
      selectFromResult: ({ data, isFetching }) => ({
        data:
          data?.data
            ?.filter((item: Picture) => item?.isActive)
            .sort(
              (a: Picture, b: Picture) =>
                new Date(a?.created_at) > new Date(b?.created_at),
            ) ?? [],
        isFetching,
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

  return (
    <div className="p-4">
      <UploadMyPicture
        isOpen={isOpenUploadNewPicture}
        quiz_id={quiz_id}
        setOpen={setOpenUploadNewPicture}
      />
      <DialogViewPicture id={picture_id!} quiz_id={quiz_id!} />
      <div className="relative">
        <h2 className="lg:text-3xl md:text-2xl text-xl mx-32 font-bold text-primary text-center">
          Tranh vẽ {quiz?.title}
        </h2>
        <div className="absolute top-0 right-4">
          {isSubmited === false && (
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
          )}
        </div>
      </div>
      <div className="mt-4">
        {data?.length === 0 && !isFetching ? (
          <div className="h-96 flex justify-center items-center">
            <h3 className="text-center text-2xl font-bold mt-10 text-gray-500">
              Chưa có bài làm nào
            </h3>
          </div>
        ) : (
          <div className="lg:columns-4 md:columns-3 space-x-4 space-y-4 columns-2">
            {data?.map((picture: Picture) => (
              <div
                key={picture._id}
                className="mb-4 rounded-lg overflow-hidden"
              >
                <Link replace href={`?id=${picture?._id}`}>
                  <Image
                    key={picture._id}
                    alt={`Tranh ${picture?.name}`}
                    height={400}
                    loading="lazy"
                    src={picture?.picture}
                    width={400}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaintingPropagandaModule;
