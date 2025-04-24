import React from "react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Picture } from "../../type.competitions";
import { useGradePictureMutation } from "../../api.picture";

import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  grade: z
    .union([z.number(), z.null()])
    .refine((val) => val === null || (val >= 0 && val <= 10), {
      message: "Điểm phải nằm trong khoảng từ 0 đến 10 hoặc để trống",
    }),
  feedback: z.optional(z.string()),
});

const PictureContent = ({
  quiz_id,
  currentPicture,
}: {
  quiz_id: string;
  currentPicture: Picture;
}) => {
  const [grade, { isLoading }] = useGradePictureMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Đang chấm điểm bức tranh...");

    try {
      await grade({
        ...values,
        quiz_result_id: currentPicture?.quiz_result_id,
      }).unwrap();
      toast.success("Chấm điểm thành công", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Chấm điểm thất bại", {
        id: toastId,
      });
    }
  }

  React.useEffect(() => {
    form.setValue("grade", currentPicture?.score ?? null);
    form.setValue("feedback", currentPicture?.feedback ?? "");
  }, [currentPicture]);

  console.log("form", form.getValues());
  console.log("currentPicture", currentPicture);

  return (
    <div className="flex gap-2">
      <Card className="">
        <CardContent className="p-4 h-[80vh]">
          <div className="h-full max-w-[700px]">
            <Image
              alt={`bức tranh về ${currentPicture?.name}`}
              className="object-contain w-full h-full rounded-md"
              height={500}
              src={currentPicture?.picture ?? "/placeholder.png"}
              width={500}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardContent className="p-1 flex max-h-[80vh] w-full">
          <ScrollArea className="w-full">
            <Form {...form}>
              <form
                className="space-y-4 p-3 w-full mx-auto py-10"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div>
                  <p className="text-lg text-center font-semibold first-letter:uppercase">
                    {currentPicture?.name}
                  </p>
                  <div className="flex gap-1 items-start">
                    <p className="min-w-12">Mô tả:</p>
                    <p className="text-base">{currentPicture?.description}</p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điểm số</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập điểm cho bức tranh"
                          type="number"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            field.onChange(
                              Number((e.target as HTMLInputElement)?.value),
                            );
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đánh giá </FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
                          placeholder="Nhập đánh giá của bạn cho thí sinh"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center gap-2">
                  <Button type="submit">Chấm</Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PictureContent;
