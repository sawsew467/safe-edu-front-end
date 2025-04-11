import React from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

import { useGetAllManagerQuery } from "@/features/users/api/manager.api";
import { Manager } from "@/features/users/user.types";
import { Combobox } from "@/components/ui/comboBox";

const InputEmail = (
  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>,
) => {
  const { managers } = useGetAllManagerQuery(undefined, {
    selectFromResult: ({ data }) => ({
      managers:
        (data?.data?.items as Manager[])
          ?.filter((item) => item?.isActive)
          .map((item) => ({ label: item?.email, value: item?.email })) ?? [],
    }),
  });

  return (
    <Combobox
      className="w-full"
      options={managers}
      placeholder="Chọn email của quản lí viên"
      value={field.value}
      variant="outline"
      onValueChange={field.onChange}
    />
  );
};

export default InputEmail;
