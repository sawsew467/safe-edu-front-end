"use client";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import { useIsDoQuizzQuery } from "../../api.quizz";

import ActionQuizz from "./action-quizz";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const getStatus = (status: string) => {
  return status ? (
    <div className="flex items-center text-green-500">
      <CheckCircledIcon className="mr-2 h-4 w-4 text-green-500" />
      <p className="text-sm">{status}</p>
    </div>
  ) : (
    <div className="flex items-center text-red-500">
      <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
      <p className="text-sm">{status}</p>
    </div>
  );
};

export default function QuizzArticleCard({
  title,
  slug,
  type,
  id,
  status,
}: {
  title: string;
  slug: string;
  type: string;
  id: string;
  status: "Upcoming" | "Outgoing" | "Ongoing";
}) {
  const { data } = useIsDoQuizzQuery({ id });

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
      <CardContent className="p-0">
        <div className="p-4 flex justify-between w-full">
          <div className=" space-y-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
            <Badge className="mb-4 bg-green-100 border-green-200 text-green-700 hover:bg-green-200 hover:text-green-800">
              {type}
            </Badge>
          </div>
          <div className="flex justify-between items-end">
            <ActionQuizz
              data={{ isSubmit: data?.data?.isSubmit, type }}
              slug={slug}
              status={status}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
