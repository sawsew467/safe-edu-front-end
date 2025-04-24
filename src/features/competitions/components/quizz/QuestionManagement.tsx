import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";

import { Quizz } from "../../type.competitions";
import { useGetQuizzByCompetitionIdQuery } from "../../api.quizz";

import FormAddNewQuizz from "./FormAddNewQuizz";
import FormUpdateQuizz from "./FormUpdateQuizz";
import QuizDetail from "./QuizDetail";

import CardList from "@/components/ui/data-card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { columns } from "@/app/quan-tri/(dashboard)/cuoc-thi/columns.quizz";

const QuizzManagement = ({ competitionId }: { competitionId: string }) => {
  const [isopen, setOpenDialog] = React.useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const idDialogQuestion = params.get("id");
  const action = params.get("action");
  const isOpenDialogQuestion = !!idDialogQuestion && !action;
  const isOpenDialogUpdate = !!idDialogQuestion && !!action;

  const { quizzs, isFetching } = useGetQuizzByCompetitionIdQuery(
    { id: competitionId },
    {
      selectFromResult: ({ data, isFetching }) => ({
        quizzs:
          data?.data?.data?.map((item: Quizz) => ({
            ...item,
            status: item?.isActive ? "Đang hoạt động" : "Ngừng hoạt động",
          })) ?? [],
        isFetching,
      }),
    },
  );

  const closeDialogQuestion = () => {
    router.push(`/quan-tri/cuoc-thi/${competitionId}?tab=phan-thi`);
  };

  const handleRowClick = ({ data }: { data: Quizz }) => {
    router.push(
      `/quan-tri/cuoc-thi/${competitionId}?tab=phan-thi&id=${data._id}`,
    );
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Phần thi</h3>
        <Dialog open={isopen} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild className="w-fit h-fit">
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => setOpenDialog(true)}
            >
              Thêm phần thi mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Thêm phần thi</DialogTitle>
            <FormAddNewQuizz
              competitionId={competitionId}
              setOpenDialog={setOpenDialog}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isOpenDialogUpdate} onOpenChange={closeDialogQuestion}>
          <DialogContent>
            <DialogTitle>Chỉnh sửa phần thi</DialogTitle>
            <FormUpdateQuizz
              competitionId={competitionId}
              idDialogQuestion={idDialogQuestion!}
              setOpenDialog={closeDialogQuestion}
            />
          </DialogContent>
        </Dialog>
        <Dialog open={isOpenDialogQuestion} onOpenChange={closeDialogQuestion}>
          <DialogTitle hidden>Danh sách câu hỏi</DialogTitle>
          <DialogContent className="!w-[90vw] !max-w-none">
            <QuizDetail
              closeDialog={closeDialogQuestion}
              id={idDialogQuestion!}
              isOpen={isOpenDialogQuestion}
            />
          </DialogContent>
        </Dialog>
      </div>
      <CardList
        columns={columns}
        data={quizzs}
        isLoading={isFetching}
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default QuizzManagement;
