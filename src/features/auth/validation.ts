import * as z from "zod";

// Validation schema for phone number step
export const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, { message: "Số điện thoại phải có ít nhất 9 chữ số" })
    .max(10, { message: "Số điện thoại không được quá 10 chữ số" })
    .regex(/^\d+$/, { message: "Số điện thoại chỉ được chứa chữ số" }),
});

export type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

// Validation schema for OTP step
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Mã OTP phải có 6 chữ số" })
    .regex(/^\d+$/, { message: "Mã OTP chỉ được chứa chữ số" }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// Validation schema for user type step
export const userTypeSchema = z.object({
  userType: z.enum(["student", "citizen"], {
    required_error: "Vui lòng chọn loại người dùng",
  }),
});

export type UserTypeFormValues = z.infer<typeof userTypeSchema>;

// Base registration schema (common fields)
const baseRegistrationSchema = z.object({
  last_name: z
    .string()
    .min(1, { message: "Vui lòng nhập họ" })
    .max(50, { message: "Họ không được quá 50 ký tự" }),
  first_name: z
    .string()
    .min(1, { message: "Vui lòng nhập tên" })
    .max(50, { message: "Tên không được quá 50 ký tự" }),
  date_of_birth: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
});

// Student registration schema (extends base schema)
export const studentRegistrationSchema = baseRegistrationSchema.extend({
  organizationId: z.string().min(1, { message: "Vui lòng chọn trường" }),
  provinceId: z.string().min(1, { message: "Vui lòng chọn trường" }),
});

// Citizen registration schema (same as base schema for now)
export const citizenRegistrationSchema = baseRegistrationSchema;

export type StudentRegistrationFormValues = z.infer<
  typeof studentRegistrationSchema
>;
export type CitizenRegistrationFormValues = z.infer<
  typeof citizenRegistrationSchema
>;
