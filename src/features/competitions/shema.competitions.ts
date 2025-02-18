import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  organizations: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  image: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
});
