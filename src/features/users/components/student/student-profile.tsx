"use client";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

import StudentProfileSkeleton from "../sekeleton/admin.sekeleton";
import { useGetStudentByIdQuery } from "../../api/student.api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import TitlePage from "@/components/ui/title-page";
import { formatDate } from "@/utils/format-date";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useAppSelector } from "@/hooks/redux-toolkit";

export default function StudentProfileModule() {
  const { id } = useParams();
  const { StudentProfile, isFetching } = useGetStudentByIdQuery(
    {
      id,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        StudentProfile: data?.data,
        isFetching,
      }),
    }
  );
  const { userId } = useAppSelector((state) => state.auth.user_role) ?? {
    userId: null,
  };

  useBreadcrumb([
    {
      label: "Học sinh",
      href: "/quan-tri/nguoi-dung?tab=student",
    },
    {
      label: `${StudentProfile?.first_name} ${StudentProfile?.last_name}`,
    },
  ]);

  return (
    <>
      <TitlePage
        href={
          userId === id
            ? `/quan-tri/nguoi-dung/hoc-sinh/${id}/chinh-sua`
            : undefined
        }
        startIcon={userId === id ? <Edit /> : undefined}
        title="Trang cá nhân"
      />
      {isFetching ? (
        <StudentProfileSkeleton />
      ) : (
        <div className="ml-4">
          <div className="flex items-center py-4 gap-4">
            <Avatar className="size-20">
              <AvatarImage
                alt={`Ảnh đại diện của ${StudentProfile?.first_name} ${StudentProfile?.last_name}`}
                className="object-cover"
                src={StudentProfile?.avatar}
              />
              <AvatarFallback>{StudentProfile?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <span className="flex gap-2 items-center">
                <h2 className="font-semibold text-2xl">
                  {StudentProfile?.first_name} {StudentProfile?.last_name}
                </h2>
                <span>
                  {StudentProfile?.isActive ? (
                    <span className="text-green-500 flex gap-1 items-center">
                      <CheckCircledIcon className="size-4 " />
                      <p>Hoạt động</p>
                    </span>
                  ) : (
                    <span className="text-red-500 flex gap-1 items-center">
                      <CrossCircledIcon className="size-4" />
                      <p>Tạm ngừng</p>
                    </span>
                  )}
                </span>
              </span>
              <p className="font-medium text-lg ">{StudentProfile?.email}</p>
              <p className="font-normal text-md ">
                {StudentProfile?.phone_number}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="">
            <h4 className="text-xl font-bold mb-4">Thông tin khác</h4>
            <div className="space-y-2">
              <span className="flex gap-2 text-sm">
                <h4>Tài khoản được tạo vào:</h4>
                <p className="">{formatDate(StudentProfile?.created_at)}</p>
              </span>
              <span className="flex gap-2 text-sm">
                <h4>Chỉnh sửa gần nhất vào:</h4>
                <p className="">{formatDate(StudentProfile?.updated_at)}</p>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
