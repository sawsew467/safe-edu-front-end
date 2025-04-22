"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { CalendarDays, GraduationCap, School, User } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import React from "react";

import { useGetStudentByUsernameQuery } from "../../api/student.api";
import { Student } from "../../user.types";

import ChangePassowordModule from "./ChangePassowordModule";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuizResultQuestion } from "@/features/competitions/type.competitions";
import { formatDate } from "@/utils/format-date";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux-toolkit";

// Tạo các component với motion
const MotionCard = motion(Card);
const MotionAvatar = motion(Avatar);
const MotionBadge = motion(Badge);
const MotionDiv = motion.div;

interface ProfileStudent extends Student {
  quizResults: QuizResultQuestion[];
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { user_role } = useAppSelector((state) => state.auth);
  const [isOpenModelChangePassword, setIsOpenModelChangePassword] =
    React.useState(false);
  const router = useRouter();
  const {
    data,
    isFetching,
    isError,
  }: { data: ProfileStudent; isFetching: boolean; isError: boolean } =
    useGetStudentByUsernameQuery(username ? { username } : skipToken, {
      selectFromResult: ({ data, isFetching, isError }) => {
        return { data: data?.data, isFetching, isError };
      },
    });

  // Tính điểm trung bình
  const averageScore = data?.quizResults
    ? data?.quizResults?.reduce(
        (acc: number, result: any) => acc + result?.score,
        0,
      ) / (data?.quizResults?.length || 1)
    : 0;

  // Variants cho animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const handleUpdateProfile = () => {
    router.push(`/trang-ca-nhan/thay-doi`);
  };
  const handleChangePassword = () => {
    setIsOpenModelChangePassword(true);
  };

  // Component Skeleton cho profile
  const ProfileSkeleton = () => (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          {/* Profile Card Skeleton */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Skeleton className="h-8 w-[200px] mx-auto mb-2" />
              <Skeleton className="h-4 w-[120px] mx-auto mb-4" />
              <div className="flex justify-center">
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </CardContent>
          </Card>

          {/* Personal Info Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px] mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3]?.map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Average Score Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="text-center mb-2">
                <Skeleton className="h-8 w-[80px] mx-auto" />
              </div>
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quiz Results Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[180px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                {[1, 2, 3]?.map((i) => (
                  <Skeleton key={i} className="h-10 w-[80px]" />
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5]?.map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Skeleton className="h-5 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                      <Skeleton className="h-6 w-[60px]" />
                    </div>
                    <Skeleton className="h-2 w-full mb-2" />
                    <Skeleton className="h-3 w-[120px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-5 w-[180px] mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5]?.map((i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_auto] gap-2 items-center"
                      >
                        <div>
                          <Skeleton className="h-4 w-[150px] mb-2" />
                          <Skeleton className="h-2 w-full" />
                        </div>
                        <Skeleton className="h-4 w-[40px]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-[150px] mb-4" />
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4]?.map((i) => (
                      <div
                        key={i}
                        className="rounded-lg border p-3 text-center"
                      >
                        <Skeleton className="h-3 w-[80px] mx-auto mb-2" />
                        <Skeleton className="h-8 w-[40px] mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Hiển thị skeleton khi đang tải
  if (isFetching) {
    return <ProfileSkeleton />;
  }
  if (isError)
    return (
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-center text-lg font-semibold">
          Học sinh không tồn tại
        </h1>
      </div>
    );

  return (
    <>
      <ChangePassowordModule
        isOpen={isOpenModelChangePassword}
        setOpen={setIsOpenModelChangePassword}
      />
      <MotionDiv
        animate="visible"
        className="container mx-auto py-6 px-4 md:px-6"
        initial="hidden"
        variants={containerVariants}
      >
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <MotionCard variants={itemVariants}>
              <CardHeader className="pb-2">
                <div className="flex justify-center">
                  <MotionAvatar
                    animate={{ scale: 1 }}
                    className="h-24 w-24"
                    initial={{ scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <AvatarImage
                      alt={`${data?.first_name} ${data?.last_name}`}
                      className="object-cover"
                      src={data?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {data?.first_name?.charAt(0)}
                      {data?.last_name?.charAt(0)}
                    </AvatarFallback>
                  </MotionAvatar>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <MotionDiv
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold">
                    {data?.first_name} {data?.last_name}
                  </h2>
                  <p className="text-muted-foreground">@{data?.username}</p>
                </MotionDiv>
                <MotionDiv
                  animate={{ opacity: 1 }}
                  className="mt-4 flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <MotionBadge
                    className="flex items-center gap-1"
                    variant="outline"
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(0,0,0,0.05)",
                    }}
                  >
                    <School className="h-3.5 w-3.5" />
                    <span>{data?.organizationId?.[0]?.name}</span>
                  </MotionBadge>
                </MotionDiv>
                {user_role?.userId === data?._id && (
                  <div className="flex mt-4 gap-4 w-full justify-center">
                    <Button onClick={handleUpdateProfile}>
                      Thay đổi hồ sơ
                    </Button>
                    <Button onClick={handleChangePassword}>Đổi mật khẩu</Button>
                  </div>
                )}
              </CardContent>
            </MotionCard>

            <MotionCard variants={itemVariants}>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MotionDiv
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 5 }}
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Họ và tên</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.first_name} {data?.last_name}
                    </p>
                  </div>
                </MotionDiv>
                <MotionDiv
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ x: 5 }}
                >
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ngày sinh</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(data?.date_of_birth)}
                    </p>
                  </div>
                </MotionDiv>
                <MotionDiv
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                  initial={{ x: -20, opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ x: 5 }}
                >
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tổ chức</p>
                    <p className="text-sm text-muted-foreground">
                      {data?.organizationId?.[0]?.name}
                    </p>
                  </div>
                </MotionDiv>
              </CardContent>
            </MotionCard>

            <MotionCard variants={itemVariants}>
              <CardHeader>
                <CardTitle>Điểm trung bình</CardTitle>
                <CardDescription>
                  Tổng hợp từ tất cả các bài kiểm tra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MotionDiv
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-3xl font-bold">
                    {averageScore?.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/10</span>
                </MotionDiv>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <MotionDiv
                    animate={{ width: `${averageScore * 10}%` }}
                    className={`h-full ${Math.round(averageScore) >= 8 ? "bg-primary" : Math.round(averageScore) >= 5 ? "bg-[#f59e0b]" : "bg-destructive"}`}
                    initial={{ width: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </CardContent>
            </MotionCard>
          </div>

          <div className="space-y-6">
            <MotionCard variants={itemVariants}>
              <CardHeader>
                <CardTitle>Lịch sử làm bài</CardTitle>
                <CardDescription>
                  Kết quả các bài kiểm tra đã hoàn thành
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 mb-6">
                  {data?.quizResults?.map(
                    (result: QuizResultQuestion, index: number) => (
                      <MotionDiv
                        key={index}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        onClick={() =>
                          router.push(
                            `/cuoc-thi/id/${result?.quiz_id?.competitionId?.at(0)}`,
                          )
                        }
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              {result?.quiz_id?.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {result?.quiz_id?.type}
                            </p>
                          </div>
                          <MotionBadge
                            animate={{ scale: 1 }}
                            className={`${result?.score >= 8 ? "bg-primary" : result?.score >= 5 ? "bg-[#f59e0b]" : "bg-destructive"}`}
                            initial={{ scale: 0 }}
                            transition={{ delay: 0.2 + 0.1 * index }}
                            variant="default"
                          >
                            {result?.score?.toFixed(1)}/10
                          </MotionBadge>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <MotionDiv
                            animate={{
                              width: `${result?.score * 10}%`,
                            }}
                            className={`h-full ${result?.score >= 8 ? "bg-primary" : result?.score >= 5 ? "bg-[#f59e0b]" : "bg-destructive"}`}
                            initial={{ width: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3 + 0.1 * index,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Hoàn thành:{" "}
                          {formatDate(result?.completedAt, "DD/MM/YYYY HH:mm")}
                        </p>
                      </MotionDiv>
                    ),
                  )}
                </div>
              </CardContent>
            </MotionCard>

            <MotionCard variants={itemVariants}>
              <CardHeader>
                <CardTitle>Phân tích kết quả</CardTitle>
                <CardDescription>Biểu đồ thành tích học tập</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium mb-2">Phân loại kết quả</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <MotionDiv
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-lg border p-3 text-center flex flex-col justify-between"
                        initial={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground">
                          Xuất sắc (≥ 9)
                        </p>
                        <MotionDiv
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-bold"
                          initial={{ y: 10, opacity: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {
                            data?.quizResults?.filter((r: any) => r.score >= 9)
                              ?.length
                          }
                        </MotionDiv>
                      </MotionDiv>
                      <MotionDiv
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-lg border p-3 text-center flex flex-col justify-between"
                        initial={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground">
                          Khá (7-8.9)
                        </p>
                        <MotionDiv
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-bold"
                          initial={{ y: 10, opacity: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {
                            data?.quizResults?.filter(
                              (r: any) => r.score >= 7 && r.score < 9,
                            )?.length
                          }
                        </MotionDiv>
                      </MotionDiv>
                      <MotionDiv
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-lg border p-3 text-center flex flex-col justify-between"
                        initial={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground">
                          Trung bình (5-6.9)
                        </p>
                        <MotionDiv
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-bold"
                          initial={{ y: 10, opacity: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {
                            data?.quizResults?.filter(
                              (r: any) => r.score >= 5 && r.score < 7,
                            )?.length
                          }
                        </MotionDiv>
                      </MotionDiv>
                      <MotionDiv
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-lg border p-3 text-center flex flex-col justify-between"
                        initial={{ scale: 0.8, opacity: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <p className="text-xs text-muted-foreground">
                          Yếu ({"< 5"})
                        </p>
                        <MotionDiv
                          animate={{ y: 0, opacity: 1 }}
                          className="text-2xl font-bold"
                          initial={{ y: 10, opacity: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          {
                            data?.quizResults?.filter((r: any) => r.score < 5)
                              ?.length
                          }
                        </MotionDiv>
                      </MotionDiv>
                    </div>
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          </div>
        </div>
      </MotionDiv>
    </>
  );
}
