"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";
import React from "react";

import {
  useGetUserQuery,
  useUpdateProfileMutation,
} from "../../api/student.api";
import { formStudentSchema } from "../../user.schema";
import { Province } from "../../user.types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TitlePage from "@/components/ui/title-page";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { DateTimeInput } from "@/components/ui/datetime-input";
import { Combobox } from "@/components/ui/comboBox";
import { useGetProvincesQuery } from "@/features/auth/api";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
};

const formUpdateStudentSchema = formStudentSchema.extend({
  provinceId: z
    .union([
      z.string({ message: "Đây là trường bắt buộc" }),
      z.null(),
      z.literal(""),
    ])
    .optional(),
  organizationId: z
    .union([
      z.string({ message: "Đây là trường bắt buộc" }),
      z.null(),
      z.literal(""),
    ])
    .optional(),
});

type OrganizationOptions = {
  label: string;
  value: string;
  province_id?: string;
};

export default function UpdateProfileModule() {
  const router = useRouter();
  const [organizationsByProvince, setOrganizationsByProvince] = React.useState(
    [],
  );
  const [selectedProvince, setSelectedProvince] = React.useState("");

  useBreadcrumb([
    {
      label: "Học sinh",
      href: "/quan-tri/nguoi-dung?tab=student",
    },
    {
      label: "Thêm học sinh mới",
    },
  ]);
  const [updateStudent] = useUpdateProfileMutation();
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.data,
    }),
  });

  const { provinces }: { provinces: Array<{ label: string; value: string }> } =
    useGetProvincesQuery(
      {},
      {
        selectFromResult: ({ data }) => {
          return {
            provinces: data?.data
              ? data?.data?.items?.map((province: Province) => ({
                  label: province?.name,
                  value: province?._id,
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
              label: org?.name,
              value: org?._id,
              province_id: org?.province_id?._id,
            }))
          : [],
      };
    },
  });
  const form = useForm<z.infer<typeof formUpdateStudentSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formUpdateStudentSchema),
    defaultValues: initialForm,
  });

  React.useEffect(() => {
    if (provinces && organizations) {
      const filteredOrganizations = organizations?.filter(
        (org: OrganizationOptions) => org?.province_id === selectedProvince,
      );

      setOrganizationsByProvince(filteredOrganizations);
    }
  }, [provinces?.length, organizations?.length, selectedProvince]);

  const handleBack = () => {
    router.back();
  };

  React.useEffect(() => {
    if (user) {
      form.setValue("first_name", user?.first_name);
      form.setValue("last_name", user?.last_name);
      form.setValue("email", user?.email);
      form.setValue("phone_number", user?.phone_number);
      form.setValue("date_of_birth", new Date(user?.date_of_birth));
      form.setValue("organizationId", user?.organizationId?.[0]?._id);
    }
  }, [user, form]);

  async function onSubmit(data: z.infer<typeof formUpdateStudentSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");
    const { email, phone_number, organizationId } = data;

    delete data.provinceId;
    if (!email) delete data.email;
    if (!phone_number) delete data.phone_number;
    if (!organizationId) delete data.organizationId;

    try {
      await updateStudent({
        ...data,
        date_of_birth: data?.date_of_birth?.toISOString(),
      }).unwrap();
      toast.success("Thay đổi tài khoản thành công", { id: toasID });
      handleBack();
    } catch (error) {
      toast.error("Thay đổi tài khoản thất bại", { id: toasID });
    }
  }

  return (
    <>
      <TitlePage title="Thay đổi hồ sơ" />
      <Form {...form}>
        <form
          className="space-y-8 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập họ..." type="text" {...field} />
                    </FormControl>
                    <FormDescription>Nhập họ và tên của bạn</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên</FormLabel>
                    <FormControl>
                      <Input placeholder="nhập tên..." type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-12  gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <DateTimeInput format="dd/MM/yyyy" {...field} />
                    </FormControl>
                    <FormDescription>ngày sinh của bạn.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="nhập sdt..."
                        {...field}
                        defaultCountry="VN"
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Nhập số điện thoại hiện tại của bạn.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nhập mail..."
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>Nhập email của bạn</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provinceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                  Tỉnh / Thành phố
                  <p className="text-red-500">*</p>
                </FormLabel>
                <FormControl>
                  <Combobox
                    options={provinces}
                    placeholder="Chọn tỉnh / thành phố"
                    value={field.value ?? ""}
                    onValueChange={(e: string) => {
                      field.onChange(e);
                      setSelectedProvince(e);
                    }}
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
                <FormLabel>Trường</FormLabel>
                <FormControl className="w-full">
                  <Select
                    {...field}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực tổ chức" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizationsByProvince?.map(
                        ({
                          label,
                          value,
                        }: {
                          label: string;
                          value: string;
                        }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Chọn tổ chức quản lí của quản lí viên này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-center">
            <Button
              className="font-medium"
              type="button"
              variant="destructive"
              onClick={handleBack}
            >
              Hủy tác vụ
            </Button>
            <Button className="font-medium" type="submit">
              Thêm
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
