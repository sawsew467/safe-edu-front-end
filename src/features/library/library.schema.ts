import * as z from "zod";

export const formLibrarySchema = z.object({
  title: z
    .string()
    .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
    .max(100, { message: "Tiêu đề quá dài" })
    .trim(),
  icon: z.string(),
  desc: z.string().min(5, { message: "Mô tả phải lớn hơn 5 chữ" }).trim(),
});
