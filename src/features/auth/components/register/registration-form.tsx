"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";

import {
  useCreateCitizenAccountMutation,
  useCreateStudentAccountMutation,
  useGetProvincesQuery,
} from "../../api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type StudentRegistrationFormValues,
  type CitizenRegistrationFormValues,
  studentRegistrationSchema,
  citizenRegistrationSchema,
} from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimeInput } from "@/components/ui/datetime-input";
import { Province } from "@/features/users/user.types";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { Combobox } from "@/components/ui/comboBox";

interface RegistrationFormProps {
  userType: "student" | "citizen";
  phoneNumber: string;
  onBack: () => void;
  otp: string | null;
}

type OrganizationOptions = {
  label: string;
  value: string;
  province_id?: string;
};

export default function RegistrationForm({
  userType,
  phoneNumber,
  onBack,
  otp,
}: RegistrationFormProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createCitizenAccount] = useCreateCitizenAccountMutation();
  const [createStudentAccount] = useCreateStudentAccountMutation();

  const { provinces }: { provinces: Array<{ label: string; value: string }> } =
    useGetProvincesQuery(
      {},
      {
        selectFromResult: ({ data }) => {
          return {
            provinces: data?.data
              ? data?.data?.items?.map((province: Province) => ({
                  label: province.name,
                  value: province._id,
                }))
              : [],
          };
        },
      },
    );
  const { organizations } = useGetAllOrganizationQuery(undefined, {
    skip: !provinces,
    selectFromResult: ({ data }) => {
      return {
        organizations: data?.data
          ? data?.data?.items?.map((org: Organization) => ({
              label: org.name,
              value: org._id,
              province_id: org?.province_id?._id,
            }))
          : [],
      };
    },
  });

  // Use the appropriate schema based on user type
  const schema =
    userType === "student"
      ? studentRegistrationSchema
      : citizenRegistrationSchema;

  // Create form with the appropriate type
  const form = useForm<
    StudentRegistrationFormValues | CitizenRegistrationFormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      last_name: "",
      first_name: "",
      date_of_birth: "",
      ...(userType === "student" ? { organizationId: "" } : {}),
    },
  });

  const organizationsByProvince = organizations?.filter(
    (org: OrganizationOptions) =>
      org?.province_id === form.getValues("provinceId"),
  );

  console.log("org", organizations);
  console.log("orgByProvince", organizationsByProvince);
  console.log("provinceId", form.getValues("provinceId"));

  const handleSubmit = async (
    data: StudentRegistrationFormValues | CitizenRegistrationFormValues,
  ) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      if (userType === "student") {
        const { provinceId, ...rest } = data as StudentRegistrationFormValues;

        await createStudentAccount({
          ...rest,
          phone_number: phoneNumber,
          otp,
        }).unwrap();
      } else {
        await createCitizenAccount({
          ...data,
          phone_number: phoneNumber,
          otp,
        }).unwrap();
      }
      setIsSubmitted(true);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardContent className="pt-10 pb-8">
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center text-center"
            initial={{ scale: 0.8, opacity: 0 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Đăng ký thành công!
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Cảm ơn bạn đã đăng ký. Thông tin của bạn đã được lưu lại thành
              công.
            </p>
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => router.push("/")}
            >
              Hoàn tất
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center">
          <Button size="icon" type="button" variant="ghost" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center text-primary flex-1 mr-8">
            Đăng ký {userType === "student" ? "Học sinh" : "Người dân"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-100">
                    Họ
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nguyễn" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-100">
                    Tên
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Văn A" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700 dark:text-gray-100">
                    Ngày sinh
                  </FormLabel>
                  <FormControl>
                    <DateTimeInput
                      format="dd/MM/yyyy"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(e) => {
                        field.onChange(e?.toISOString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="provinceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-100">
                        Tỉnh / Thành phố
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={provinces}
                          placeholder="Chọn tỉnh / thành phố"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-100">
                        Tô chức
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={organizationsByProvince}
                          placeholder="Chọn tổ chức"
                          value={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
