"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useDeleteCompetitionsMutation,
  useGetCompetitionsQuery,
} from "../api.competitions";

import ContestantManagement from "./contestant-management";
import QuestionManagement from "./quizz/QuestionManagement";
import UpdateCompetitions from "./form-update-new-competition";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/custom-tabs";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import TitlePage from "@/components/ui/title-page";
import { Button } from "@/components/ui/button";

const DetailCompetitions = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "";
  const { id: competitionId } = useParams<{ id: string }>();

  const [deleteCompetition, { isLoading }] = useDeleteCompetitionsMutation();
  const { competition } = useGetCompetitionsQuery(
    { id: competitionId },
    {
      skip: !competitionId,
      selectFromResult: ({ data }) => ({
        competition: data?.data,
      }),
    },
  );

  const handleChangeTabs = ({
    target: { id },
  }: {
    target: HTMLButtonElement;
  } & React.MouseEvent<HTMLButtonElement>) => {
    router.replace(`?tab=${id}`);
  };

  useBreadcrumb([
    {
      label: `Quản lý cuộc thi`,
      href: "/quan-tri/cuoc-thi",
    },
    {
      label: competition?.title ?? "",
    },
  ]);
  const handleDeleteCompetitions = () => {
    const toastId = toast.loading("Đang xóa cuộc thi này...");

    try {
      if (competition) {
        deleteCompetition({ id: competitionId }).unwrap();
        toast.success("Xóa cuộc thi thành công", { id: toastId });
        router.push("/quan-tri/cuoc-thi");
      }
    } catch {
      toast.error("Xóa cuộc thi thất bại", { id: toastId });
    }
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
        <TabsTrigger id="phan-thi" value="phan-thi" onClick={handleChangeTabs}>
          Phần thi
        </TabsTrigger>
        <TabsTrigger id="cai-dat" value="cai-dat" onClick={handleChangeTabs}>
          Cài đặt
        </TabsTrigger>
      </TabsList>
      <div className="p-4 bg-background rounded-md ">
        <TabsContent value="nguoi-tham-gia">
          <ContestantManagement />
        </TabsContent>
        <TabsContent value="phan-thi">
          <QuestionManagement competitionId={competitionId} />
        </TabsContent>
        <TabsContent value="cai-dat">
          <div className="flex w-full justify-between mb-4">
            <TitlePage title="Chỉnh sửa nội dung cuộc thi" />
            <Button
              isLoading={isLoading}
              variant="destructive"
              onClick={handleDeleteCompetitions}
            >
              Kết thúc cuộc thi này
            </Button>
          </div>
          <UpdateCompetitions competitionId={competitionId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DetailCompetitions;
