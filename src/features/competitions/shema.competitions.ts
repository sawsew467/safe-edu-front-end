import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  description: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  startDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Ngày không hợp lệ.",
    }),
  endDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Ngày không hợp lệ.",
    }),
  image_url: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
});
