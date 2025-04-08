import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";

import { Quizz } from "../../type.competitions";
import { fakeData } from "../../data.competitions";
import QuestionManagement from "../question/question-management";

import FormAddNewQuizz from "./FormAddNewQuizz";

import CardList from "@/components/ui/data-card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { columns } from "@/app/(dashboard)/cuoc-thi/columns.quizz";
import { StatusCompetition } from "@/settings/enums";

const QuizzManagement = () => {
  const [isopen, setOpenDialog] = React.useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const { id: idCompetitions } = useParams<{ id: string }>();

  const idDialogQuestion = params.get("id");
  const isOpenDialogQuestion = !!idDialogQuestion;
  const data = fakeData.map((item) => ({
    ...item,
    status: item?.status
      ? StatusCompetition[item.status as keyof typeof StatusCompetition]
      : "unkown",
  }));

  const closeDialogQuestion = () => {
    router.push(`/cuoc-thi/${idCompetitions}?tab=cac-cuoc-thi`);
  };

  const handleRowClick = ({ data }: { data: Quizz }) => {
    router.push(`/cuoc-thi/${idCompetitions}?tab=cac-cuoc-thi&id=${data._id}`);
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <h3 className="text-2xl font-bold mb-4">Các cuộc thi</h3>
        <Dialog open={isopen} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild className="w-fit h-fit">
            <Button
              className="ml-auto"
              variant="outline"
              onClick={() => setOpenDialog(true)}
            >
              Thêm cuộc thi mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Thêm cuộc thi</DialogTitle>
            <FormAddNewQuizz setOpenDialog={setOpenDialog} />
          </DialogContent>
        </Dialog>
        <Dialog open={isOpenDialogQuestion} onOpenChange={closeDialogQuestion}>
          <DialogTitle hidden>Danh sách câu hỏi</DialogTitle>
          <DialogContent className="!w-[90vw] !max-w-none">
            <QuestionManagement
              closeDialog={closeDialogQuestion}
              id={idDialogQuestion}
            />
          </DialogContent>
        </Dialog>
      </div>
      <CardList columns={columns} data={data} onRowClick={handleRowClick} />
    </>
  );
};

export default QuizzManagement;
