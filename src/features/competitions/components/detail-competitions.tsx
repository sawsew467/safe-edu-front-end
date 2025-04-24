"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import {
  useActiveCompetitionsMutation,
  useDeleteCompetitionsMutation,
  useGetCompetitionsQuery,
} from "../api.competitions";
import { Competitions } from "../type.competitions";

import QuestionManagement from "./quizz/QuestionManagement";
import UpdateCompetitions from "./form-update-new-competition";
import PremiumLeaderboardAdmin from "./leaderBoadAdmin";

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
  const [activeCompetition, { isLoading: isLoadingActive }] =
    useActiveCompetitionsMutation();
  const { competition }: { competition: Competitions } =
    useGetCompetitionsQuery(
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
  const handleActiveCompetitions = async () => {
    const toastId = toast.loading("Đang xóa cuộc thi này...");

    try {
      if (competition) {
        if (competition?.isActive) {
          await deleteCompetition({ id: competitionId }).unwrap();
          toast.success("Kết thúc cuộc thi thành công", { id: toastId });
        } else {
          await activeCompetition({ id: competitionId }).unwrap();
          toast.success("Khôi phục cuộc thi thành công", { id: toastId });
        }
      }
    } catch {
      if (competition?.isActive) {
        toast.error("Kết thúc cuộc thi thất bại", { id: toastId });
      } else {
        toast.error("Khôi phục cuộc thi thất bại", { id: toastId });
      }
    }
  };

  console.log("competition", competition);

  return (
    <Tabs defaultValue={tab || "bang-xep-hang"}>
      <TabsList>
        <TabsTrigger
          id="bang-xep-hang"
          value="bang-xep-hang"
          onClick={handleChangeTabs}
        >
          Bảng xếp hạng
        </TabsTrigger>
        <TabsTrigger id="phan-thi" value="phan-thi" onClick={handleChangeTabs}>
          Phần thi
        </TabsTrigger>
        <TabsTrigger id="cai-dat" value="cai-dat" onClick={handleChangeTabs}>
          Cài đặt
        </TabsTrigger>
      </TabsList>
      <div className="p-4 bg-background rounded-md ">
        <TabsContent value="bang-xep-hang">
          <PremiumLeaderboardAdmin slug={competition?.slug} />
        </TabsContent>
        <TabsContent value="phan-thi">
          <QuestionManagement competitionId={competitionId} />
        </TabsContent>
        <TabsContent value="cai-dat">
          <div className="flex w-full justify-between mb-4">
            <TitlePage title="Chỉnh sửa nội dung cuộc thi" />
            <Button
              isLoading={isLoading ?? isLoadingActive}
              variant={competition?.isActive ? "destructive" : "default"}
              onClick={handleActiveCompetitions}
            >
              {competition?.isActive
                ? "Kết thúc cuộc thi này"
                : "Khôi phục cuộc thi này"}
            </Button>
          </div>
          <UpdateCompetitions competitionId={competitionId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DetailCompetitions;
