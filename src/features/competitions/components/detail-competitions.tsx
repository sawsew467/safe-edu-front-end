"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";

import ContestantManagement from "./contestant-management";
import QuestionManagement from "./quizz/QuestionManagement";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";

const DetailCompetitions = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "";
  const handleChangeTabs = ({
    target: { id },
  }: {
    target: HTMLButtonElement;
  } & React.MouseEvent<HTMLButtonElement>) => {
    router.replace(`?tab=${id}`);
  };

  return (
    <Tabs defaultValue={tab || "nguoi-tham-gia"}>
      <TabsList>
        <TabsTrigger
          id="nguoi-tham-gia"
          value="nguoi-tham-gia"
          onClick={handleChangeTabs}
        >
          Người tham gia
        </TabsTrigger>
        <TabsTrigger
          id="cac-cuoc-thi"
          value="cac-cuoc-thi"
          onClick={handleChangeTabs}
        >
          Các câu hỏi
        </TabsTrigger>
      </TabsList>
      <div className="p-4 bg-background rounded-md ">
        <TabsContent value="nguoi-tham-gia">
          <ContestantManagement />
        </TabsContent>
        <TabsContent value="cac-cuoc-thi">
          <QuestionManagement />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DetailCompetitions;
