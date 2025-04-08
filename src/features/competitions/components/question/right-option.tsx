import React from "react";
import { Star, Timer } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Question } from "../../type.competitions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const formSchema = z.object({
  timeLimit: z.string().default("20"),
  point: z.string().default("standard"),
});
const RightOption = ({
  currentQuestion,
  option,
  setOption,
}: {
  currentQuestion: number;
  option: Question["options"];
  setOption: React.Dispatch<React.SetStateAction<Question[]>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      timeLimit: "20",
      point: "standard",
    },
  });

  React.useEffect(() => {
    form.reset({
      timeLimit: option?.timeLimit ?? "20",
      point: option?.point ?? "standard",
    });
  }, [currentQuestion, option]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    setOption((prev) => {
      const newOption = {
        _id: prev[currentQuestion]?._id ?? "0",
        question: prev[currentQuestion]?.question ?? "",
        correct_answer: prev[currentQuestion]?.correct_answer ?? "",
        answer: prev[currentQuestion]?.answer ?? [],
        image: prev[currentQuestion]?.image ?? "",
        options: { ...data },
      };

      return prev.toSpliced(currentQuestion, 1, newOption);
    });
  }

  return (
    <div className="h-full p-2 dark:bg-gray-600 bg-gray-200 rounded-lg">
      <Form {...form}>
        <form className="space-y-6" onChange={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="timeLimit"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="flex items-center gap-2 mb-2">
                  <div className="text-gray-500">
                    <Timer color="white" size={20} />
                  </div>
                  <span className="font-medium">Giới hạn thời gian</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới hạn thời gian câu hỏi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 giây</SelectItem>
                      <SelectItem value="20">20 giây</SelectItem>
                      <SelectItem value="30">30 giây</SelectItem>
                      <SelectItem value="60">60 giây</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="point"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="flex items-center gap-2 mb-2">
                  <div className="text-gray-500">
                    <Star color="white" size={20} />
                  </div>
                  <span className="font-medium">Ngôi sao hy vọng</span>
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Bình thường</SelectItem>
                      <SelectItem value="double">Gấp đôi điểm</SelectItem>
                      <SelectItem value="triple">Gấp ba điểm</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default RightOption;
