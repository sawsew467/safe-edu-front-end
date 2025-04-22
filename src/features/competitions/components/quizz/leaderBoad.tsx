"use client";
import {
  Award,
  Crown,
  Medal,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import { useGetLeaderBoardQuery } from "../../api.quizz";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string;
  id: string;
}

interface UserScore {
  user: User;
  score: number;
}

interface ApiResponse {
  code: number;
  message: string;
  data: UserScore[];
}

const getMaxScore = (data: UserScore[]) => {
  if (!data.length) return 0;

  return Math.max(...data.map((item) => item.score));
};

export default function PremiumLeaderboard({ slug }: { slug: string }) {
  // Use React Query to fetch data
  const { data, isLoading, error } = useGetLeaderBoardQuery(
    { slug },
    {
      selectFromResult: ({ data, isLoading, error }) => ({
        data: data?.data as UserScore[],
        isLoading,
        error,
      }),
    }
  );

  const totalScore = data?.reduce((acc, item) => acc + item.score, 0) || 0;
  const averageScore = totalScore / (data?.length || 1);

  if (error) {
    return (
      <Card className="border-red-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-center text-red-500">
            <span>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxScore = data ? getMaxScore(data) : 0;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-amber-800">
                  Tổng Thí sinh
                </h3>
                <p className="text-2xl font-bold text-amber-900">
                  {data.length}
                </p>
              </div>
              <div className="rounded-full bg-amber-200 p-3">
                <Users className="h-6 w-6 text-amber-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-emerald-800">
                  Điểm Cao Nhất
                </h3>
                <p className="text-2xl font-bold text-emerald-900">
                  {maxScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-full bg-emerald-200 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-700" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-purple-800">
                  Điểm trung bình
                </h3>
                <p className="text-2xl font-bold text-purple-900">
                  {averageScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-full bg-purple-200 p-3">
                <Award className="h-6 w-6 text-purple-700" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="relative mx-auto h-80 max-w-2xl">
        {/* Second Place */}
        {data?.length >= 2 && (
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="absolute left-0 bottom-0 w-1/3"
            initial={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 border-4 border-gray-300 shadow-lg">
                <AvatarImage
                  alt={`${data?.[1]?.user.first_name} ${data?.[1]?.user.last_name}`}
                  src={data?.[1]?.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-gray-300 text-gray-700">
                  {data?.[1]?.user.first_name.charAt(0)}
                  {data?.[1]?.user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 rounded-full bg-gray-200 p-1.5">
                <Medal className="h-5 w-5 text-gray-600" />
              </div>
              <p className="mt-1 text-center font-medium text-sm">
                {data?.[1]?.user.first_name}
              </p>
              <p className="text-gray-600 text-xs">
                {data?.[1]?.score.toFixed(1)}
              </p>
            </div>
            <div className="mx-auto mt-2 h-20 w-24 rounded-t-lg bg-gray-300" />
          </motion.div>
        )}

        {/* First Place */}
        {data?.length >= 1 && (
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="absolute left-1/3 bottom-0 w-1/3"
            initial={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-1">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <Avatar className="h-20 w-20 border-4 border-yellow-400 shadow-lg">
                <AvatarImage
                  alt={`${data?.[0]?.user.first_name} ${data?.[0]?.user.last_name}`}
                  src={data?.[0]?.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-yellow-100 text-yellow-800">
                  {data?.[0]?.user.first_name.charAt(0)}
                  {data?.[0]?.user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 rounded-full bg-yellow-200 p-1.5">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <p className="mt-1 text-center font-bold">
                {data?.[0]?.user.first_name}
              </p>
              <p className="text-yellow-600 font-medium">
                {data?.[0]?.score.toFixed(1)}
              </p>
            </div>
            <div className="mx-auto mt-2 h-32 w-24 rounded-t-lg bg-yellow-400" />
          </motion.div>
        )}

        {/* Third Place */}
        {data?.length >= 3 && (
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="absolute right-0 bottom-0 w-1/3"
            initial={{ y: 50, opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <Avatar className="h-14 w-14 border-4 border-amber-700 shadow-lg">
                <AvatarImage
                  alt={`${data?.[2]?.user.first_name} ${data?.[2]?.user.last_name}`}
                  src={data?.[2]?.user.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="bg-amber-100 text-amber-800">
                  {data?.[2]?.user.first_name.charAt(0)}
                  {data?.[2]?.user.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 rounded-full bg-amber-200 p-1.5">
                <Medal className="h-5 w-5 text-amber-700" />
              </div>
              <p className="mt-1 text-center font-medium text-sm">
                {data?.[2]?.user.first_name}
              </p>
              <p className="text-amber-700 text-xs">
                {data?.[2]?.score.toFixed(1)}
              </p>
            </div>
            <div className="mx-auto mt-2 h-16 w-24 rounded-t-lg bg-amber-700" />
          </motion.div>
        )}
      </div>

      {/* Main Leaderboard */}
      <Card className="max-w-6xl mx-auto overflow-hidden border-none shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#75A815] to-[#8BC34A] py-6">
          <div className="flex items-center justify-center space-x-2 text-white">
            <Trophy className="h-6 w-6" />
            <h2 className="text-center text-2xl font-bold">Bảng Xếp Hạng</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : (
            <div>
              <div className="grid grid-cols-12 bg-gray-100 dark:bg-gray-800 p-4 text-sm font-medium text-gray-500 dark:text-gray-100">
                <div className="col-span-2 text-start">Hạng</div>
                <div className="col-span-6 md:col-span-4">Thí sinh</div>
                <div className="col-span-4 md:col-span-6 text-center">
                  Điểm số
                </div>
                {/* <div className="hidden md:col-span-4 md:block">Tiến độ</div> */}
              </div>
              <div className="w-full">
                {data?.map((item: UserScore, index) => (
                  <LeaderboardItem
                    key={item.user._id}
                    maxScore={maxScore}
                    rank={index + 1}
                    userScore={item}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardItem({
  userScore,
  rank,
  maxScore,
}: {
  userScore: UserScore;
  rank: number;
  maxScore: number;
}) {
  const { user, score } = userScore;
  const fullName = `${user.first_name} ${user.last_name}`;

  // Format score to 2 decimal places if needed
  const formattedScore = score % 1 === 0 ? score.toString() : score.toFixed(1);

  // Calculate progress percentage
  const progressPercentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Determine if this is a top 3 position
  const isTopThree = rank <= 3;

  // Determine rank styling
  const getRankStyles = () => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700";
      case 3:
        return "bg-gradient-to-r from-amber-700 to-amber-600 text-amber-100";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "grid grid-cols-12 items-center border-b border-gray-100 dark:border-gray-900 dark:hover:border-gray-800 p-4 hover:bg-gray-50 transition-colors",
        isTopThree && "bg-gray-50 dark:bg-gray-700"
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: rank * 0.05, duration: 0.3 }}
    >
      {/* Rank */}
      <div className="col-span-2 flex justify-start">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full font-bold shadow-sm",
            getRankStyles()
          )}
        >
          {rank}
        </div>
      </div>

      {/* User Info */}
      <div className="col-span-6 md:col-span-4 flex items-center">
        <div className="relative">
          <Avatar
            className={cn(
              "h-10 w-10 border-2",
              rank === 1
                ? "border-yellow-400"
                : rank === 2
                  ? "border-gray-300"
                  : rank === 3
                    ? "border-amber-700"
                    : "border-gray-200"
            )}
          >
            <AvatarImage
              alt={fullName}
              src={user.avatar || "/placeholder.svg"}
            />
            <AvatarFallback>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
          </Avatar>
          {isTopThree && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1 rounded-full p-0.5",
                rank === 1
                  ? "bg-yellow-400"
                  : rank === 2
                    ? "bg-gray-300"
                    : "bg-amber-700"
              )}
            >
              <Star className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="ml-3">
          <div className="font-medium line-clamp-1">{fullName}</div>
          <div className="text-xs text-gray-500">@{user.username}</div>
        </div>
      </div>

      {/* Score */}
      <div className="col-span-4 md:col-span-6 flex justify-center">
        <Badge
          className={cn(
            "px-3 py-1 font-medium",
            rank === 1
              ? "bg-yellow-500 text-yellow-950"
              : rank === 2
                ? "bg-gray-400 text-gray-950"
                : rank === 3
                  ? "bg-amber-700 text-white"
                  : "bg-[#75A815] text-white"
          )}
        >
          {formattedScore} điểm
        </Badge>
      </div>

      {/* Progress Bar (hidden on mobile) */}
      {/* <div className="hidden md:col-span-4 md:flex md:items-center md:pr-4">
        <div className="w-full">
          <Progress
            className={cn(
              "h-2",
              rank === 1
                ? "bg-yellow-100 [&>div]:bg-yellow-500"
                : rank === 2
                  ? "bg-gray-100 [&>div]:bg-gray-400"
                  : rank === 3
                    ? "bg-amber-100 [&>div]:bg-amber-700"
                    : "bg-green-100 [&>div]:bg-[#75A815]",
            )}
            value={progressPercentage}
          />
          <div className="mt-1 text-right text-xs text-gray-500">
            {progressPercentage.toFixed(0)}%
          </div>
        </div>
      </div> */}
    </motion.div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-12 bg-gray-100 p-4 text-sm font-medium text-gray-500">
        <div className="col-span-1 text-center">Hạng</div>
        <div className="col-span-7 md:col-span-5">Thí sinh</div>
        <div className="col-span-4 md:col-span-2 text-center">Điểm số</div>
        <div className="hidden md:col-span-4 md:block">Tiến độ</div>
      </div>

      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="grid grid-cols-12 items-center border-b border-gray-100 p-4"
        >
          <div className="col-span-1 flex justify-center">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          <div className="col-span-7 md:col-span-5 flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3 space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          <div className="col-span-4 md:col-span-2 flex justify-center">
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="hidden md:col-span-4 md:flex md:items-center md:pr-4">
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
