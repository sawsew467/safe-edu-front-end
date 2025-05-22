"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";

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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  useGetAllOrganizationQuery,
  useGetOrganizationByIdQuery,
} from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { useAddNewManagerMutation } from "@/features/users/api/manager.api";
import { formManagerSchema } from "@/features/users/user.schema";
import { useAppSelector } from "@/hooks/redux-toolkit";
import useBreadcrumb from "@/hooks/useBreadcrumb";
const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
};

export default function AddNewManagerModule() {
  const router = useRouter();
  const { id: organizationId } = useParams<{ id: string }>();

  const { organization }: { organization: Organization } =
    useGetOrganizationByIdQuery(
      { id: organizationId },
      {
        skip: !organizationId,
        selectFromResult: ({ data }) => {
          return {
            organization: data?.data,
          };
        },
      }
    );
  const { current_organization } = useAppSelector((state) => state.auth);

  useBreadcrumb(
    current_organization
      ? [
          {
            label: `Quản lý tổ chức`,
            href: "/quan-tri/to-chuc",
          },
        ]
      : [
          {
            label: `Quản lý tổ chức`,
            href: "/quan-tri/to-chuc",
          },
          {
            label: organization?.name ?? "",
            href: `/quan-tri/to-chuc/${organizationId}`,
          },
          {
            label: "Thêm quản lí viên mới",
          },
        ]
  );

  const [createManagerAccount] = useAddNewManagerMutation();
  const { organizations } = useGetAllOrganizationQuery(undefined, {
    selectFromResult: ({ data }) => ({
      organizations:
        data?.data?.items?.map((item: Organization) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });

  const form = useForm<z.infer<typeof formManagerSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formManagerSchema),
    defaultValues: initialForm,
  });
  const handleBack = () => {
    router.replace(`/quan-tri/to-chuc/${organizationId}`);
  };

  async function onSubmit(data: z.infer<typeof formManagerSchema>) {
    const toasID = toast.loading("đang tạo tài khoản...");

    try {
      await createManagerAccount({
        ...data,
        organizationId,
      }).unwrap();
      toast.success("Tạo tài khoản thành công", { id: toasID });
      router.replace(`/quan-tri/to-chuc/${organizationId}`);
    } catch (error) {
      toast.error("Tạo tài khoản thất bại", { id: toasID });
    }
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage title="Thêm quản lý viên" />
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
                      <Input placeholder="Nhập họ..." type="text" {...field} />
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
                      <Input placeholder="Nhập tên..." type="" {...field} />
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập email..."
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Email làm việc của bạn.</FormDescription>
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
                        placeholder="Nhập sdt..."
                        {...field}
                        defaultCountry="VN"
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
          {/* <FormField
            control={form.control}
            name="organizationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tổ chức quản lí</FormLabel>
                <FormControl className="w-full">
                  <Select
                    {...field}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khu vực tổ chức" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations?.map(
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
                        )
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
          /> */}
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
    </div>
  );
}
