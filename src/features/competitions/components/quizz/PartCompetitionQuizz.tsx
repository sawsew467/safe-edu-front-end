"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import { useSubmissionQuestionMutation } from "../../api.question";

import OptionsForm from "./OptionsForm";

import { Badge } from "@/components/ui/badge";
import { PartQuestion } from "@/app/(exam)/phan-thi/[id]/page";
import { Button } from "@/components/ui/button";
import { TimerProgress } from "@/components/ui/timer-progress";
import TimerProgressCircle from "@/components/ui/timer-progress-circle";
import { Card } from "@/components/ui/card";
interface PropsPartCompetitionQuizz {
  title?: string;
  question?: PartQuestion[];
}
export const formSchema = z.object({
  choice_question: z.string({
    required_error: "Please select an answer.",
  }),
});
const PartCompetitionQuizz = ({
  title,
  question,
}: PropsPartCompetitionQuizz) => {
  const router = useRouter();
  const { id } = useParams();
  const [current_time, set_current_time] = React.useState(0);
  const [current_question_index, set_current_question] =
    React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const current_question = question?.at(current_question_index);
  const currentTimeLimit = Number(current_question?.time_limit);
  const [submissionQuestion] = useSubmissionQuestionMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      choice_question: "",
    },
  });

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!open)
      interval = setInterval(() => {
        set_current_time((prev) => (prev < currentTimeLimit ? prev + 1 : prev));
      }, 1000);

    return () => clearInterval(interval);
  }, [open]);
  React.useEffect(() => {
    if (current_question?._id) {
      set_current_time(0);
    }
  }, [current_question?._id]);
  React.useEffect(() => {
    if (!question) return;
    if (current_time >= currentTimeLimit) {
      onSubmit({ choice_question: "" });
    }
  }, [current_time]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    submissionQuestion({
      answer: data.choice_question,
      question_id: current_question?._id,
    });
    if (current_question_index + 1 < question!.length) {
      setOpen(true);
      set_current_time(0);

      if (current_question_index < question!.length) {
        set_current_question((prev) => prev + 1);
        setOpen(false);
      }
    } else {
      router.replace(`/phan-thi/${id}/ket-qua`);
    }
  };

  return (
    <section className=" md:px-4 px-2 md:py-4 py-2 h-full bg-gradient-to-b from-primary/20 via-white to-primary/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4 mb-4">
          <div className="flex w-full justify-between gap-4 items-center">
            <Button
              className="flex items-center gap-1 rounded-full px-4 py-2 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
              size="sm"
              variant="outline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-lg font-semibold md:block hidden">
                Trở về
              </span>
            </Button>
            <div className="gap-2 flex">
              <Badge
                className="bg-indigo-100 dark:bg-indigo-900/40 px-4 py-1.5 rounded-full text-indigo-700 dark:text-indigo-300 font-medium text-sm shadow-sm"
                variant="outline"
              >
                Câu {current_question_index + 1} trên {question?.length ?? 0}
              </Badge>
              <Badge
                className=" md:block hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full font-medium text-sm shadow-sm"
                variant="outline"
              >
                {title}
              </Badge>
            </div>
          </div>
          <div className="md:hidden flex w-full justify-between gap-4 items-center">
            <TimerProgress
              className="w-full"
              max={currentTimeLimit}
              value={currentTimeLimit - current_time}
            />
          </div>
        </div>
        <Card className="relative p-4 mb-4 flex-1 bg-white dark:bg-gray-800 shadow-lg border-0 rounded-2xl">
          <div className="flex justify-center mb-4">
            <motion.div
              key={current_question?.question}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold py-3 px-8 rounded-xl shadow-md"
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            >
              {current_question?.question}
            </motion.div>
          </div>

          <div className=" flex justify-center items-center mb-4">
            {current_question?.image && (
              <motion.div
                key={id + current_question.image} // Add key to trigger re-animation on image change
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              >
                <Image
                  alt={current_question?.question ?? "Không tìm thấy ảnh"}
                  className="md:max-w-[300px] max-w-[250px] max-h-[250px] md:max-h-[300px] w-max h-max object-contain rounded-lg"
                  height={400}
                  src={current_question?.image ?? "/placeholder.png"}
                  width={400}
                />
              </motion.div>
            )}
          </div>
          <div className="md:block absolute hidden top-1/2 -translate-y-1/2 left-4 mt-0 h-[150px]">
            <TimerProgressCircle
              maxValue={currentTimeLimit}
              size={150}
              strokeWidth={14}
              value={currentTimeLimit - current_time}
            />
          </div>
        </Card>
        <div>
          <OptionsForm
            current_answer={current_question?.answer}
            form={form}
            id={current_question?._id}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </section>
  );
};

export default PartCompetitionQuizz;
