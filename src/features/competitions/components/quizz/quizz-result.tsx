"use client";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import React from "react";

import { QuizResultQuestion } from "../../type.competitions";

import { CircularProgress } from "./circural-result";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/format-date";
import { deleteClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

type User = {
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar?: string | null;
};

interface QuizResultsProps {
  quizData: QuizResultQuestion;
  user?: User;
}

export default function QuizResults({ quizData, user }: QuizResultsProps) {
  const router = useRouter();

  React.useLayoutEffect(() => {
    if (!quizData || !user) {
      deleteClientCookie(constants.ACCESS_TOKEN);
      deleteClientCookie(constants.USER_INFO);
      deleteClientCookie(constants.REFRESH_TOKEN);
      router.replace("/dang-nhap");
    }
  }, []);

  const { quiz_id: quizz, questions: questions, score, completedAt } = quizData;
  const totalQuestions = questions?.length || 0;
  const correctAnswers = questions?.reduce(
    (acc, question) => acc + (question.isCorrect ? 1 : 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl text-primary font-bold text-center mb-8">
        {quizz?.title} - Kết quả
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin người làm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-gray-200">
              <Image
                fill
                alt={`${user?.first_name || ""} ${user?.last_name || ""}`}
                className="object-cover"
                src={user?.avatar || "/placeholder.svg"}
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {user?.first_name || ""} {user?.last_name || ""}
              </h3>
              <p className="text-sm text-gray-600">
                Tên đăng nhập: {user?.username}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <CardTitle>Điểm của bạn</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CircularProgress percent={score} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tổng kết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center col-span-2 flex justify-center items-center gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nộp bài vào lúc:
                </p>
                <p className="md:text-2xl text-md font-bold">
                  {formatDate(completedAt, "HH:mm:ss [Ngày] DD/MM")}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tổng số câu
                </p>
                <p className="md:text-2xl text-md  font-bold">
                  {totalQuestions}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Câu trả lời đúng
                </p>
                <p className="md:text-2xl text-md  font-bold">
                  {correctAnswers}
                </p>
              </div>
            </div>
            <div className="md:pt-4 pt-2">
              <h3 className="font-medium mb-2">Lời nhắn</h3>
              <div className="text-sm mb-2">
                {score >= 8 ? (
                  <p className="text-green-600 dark:text-green-400">
                    Tuyệt vời! Bạn đã nắm vững chủ đề này.
                  </p>
                ) : score >= 6 ? (
                  <p className="text-yellow-600 dark:text-yellow-400">
                    Làm tốt lắm! Luyện tập thêm một chút sẽ giúp ích.
                  </p>
                ) : (
                  <p className="text-red-600 dark:text-red-400">
                    Hãy tiếp tục luyện tập! Bạn sẽ tiến bộ khi học nhiều hơn.
                  </p>
                )}
              </div>
              <Button onClick={() => router.push("..")}>
                Quay về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
