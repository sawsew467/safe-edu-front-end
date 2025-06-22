import * as z from "zod";

export const formDocumentSchema = z.object({
  name: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
  file: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
});
