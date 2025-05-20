"use client";

import Image from "next/image";
import { TimerIcon } from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

import ActionCompetitions from "./action-join-compeititions";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";

const getStatus = (status: string) => {
  switch (status) {
    case "Upcoming":
      return (
        <div className="flex items-center text-yellow-500">
          <TimerIcon className="mr-2 h-4 w-4 text-yellow-500" />
          <p className="text-xs">Sắp diễn ra</p>
        </div>
      );
    case "Outgoing":
      return (
        <div className="flex items-center text-red-500">
          <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-xs">Đã kết thúc</p>
        </div>
      );
    case "Ongoing":
      return (
        <div className="flex items-center text-green-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-green-500" />
          <p className="text-xs">Đang diễn ra</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center text-red-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-xs">Đã kết thúc</p>
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
}: {
  title: string;
  startDate: string;
  endDate: string;
  image?: string | null;
  slug: string;
  description: string;
}) {
  const status =
    new Date(startDate) > new Date()
      ? "Upcoming"
      : new Date(endDate) < new Date()
        ? "Outgoing"
        : "Ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <CardContent className="p-0 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <Badge className="absolute backdrop-blur-lg top-2 right-2 z-10 shadow-md bg-white/60 dark:bg-black/60 hover:bg-white/60 text-primary rounded-full">
               {getStatus(status)}
            </Badge>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            <Image
              alt={title}
              className="w-full h-48 object-cover"
              height={200}
              src={image || "/placeholder.svg"}
              width={300}
            />
          </motion.div>
          <div className="flex flex-col flex-1 p-4">
            <motion.h3
              className="font-semibold text-lg mb-2 min-h-14 line-clamp-2"
              initial={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="text-base line-clamp-2 min-h-12 flex-1 mb-2"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-col gap-1"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1 }}
            >
              <div className="flex gap-2">
                <p className=" text-sm">Bắt đầu:</p>
                <span className="text-gray-500 text-sm">
                  <p className="capitalize">
                    {formatDate(startDate, "dddd, DD/MM")}
                  </p>
                </span>
              </div>
              <div className="flex gap-2">
                <p className="text-sm">Kết thúc:</p>
                <span className="text-gray-500 text-sm">
                  <p className="capitalize">
                    {" "}
                    {formatDate(endDate, "dddd, DD/MM")}
                  </p>
                </span>
              </div>
            </motion.div>
            <motion.div
              className="flex w-full justify-between mt-4"
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <ActionCompetitions slug={slug} status={status} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
