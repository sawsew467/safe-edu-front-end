import z from "zod";

export const reportSchema = z.object({
  victim_name: z.string().optional(),
  class_grade: z.string().min(1, "Vui lòng nhập lớp/khối"),
  gender: z.string().optional(),
  relationship_to_victim: z.string().optional(),
  relationship_other: z.string().optional(),
  violence_types: z
    .array(z.string())
    .min(1, "Chọn ít nhất một hình thức bạo lực"),
  violence_other: z.string().optional(),
  location: z.string().optional(),
  location_other: z.string().optional(),
  time_of_incident: z.string().optional(),
  impact_level: z.string().optional(),
  current_situation: z.string().optional(),
  information_sources: z
    .array(z.string())
    .min(1, "Chọn ít nhất một nguồn thông tin"),
  information_reliability: z.string().optional(),
  contact_option: z.boolean().optional(),
  contact_info: z.string().optional(),
  external_contact_info: z.string().optional(),
  organizationId: z.string().min(1, "Vui lòng chọn trường học"),
});

export type ReportFormSchema = z.infer<typeof reportSchema>;
