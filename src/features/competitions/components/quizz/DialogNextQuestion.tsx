import React from "react";

import { Card, CardContent } from "@/components/ui/card";

const DialogNextQuestion = ({
  open,
  current_question_index,
  total_question = 0,
}: {
  open: boolean;
  current_question_index: number;
  total_question?: number;
}) => {
  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 shadow-lg rounded-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h2 className="text-2xl font-bold text-[#75A815]">
                Câu {current_question_index + 2} trên {total_question}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default DialogNextQuestion;
