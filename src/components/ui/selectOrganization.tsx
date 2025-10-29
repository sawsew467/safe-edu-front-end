"use client";
import React, { useState } from "react";
import { useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Combobox } from "./comboBox";

import { useGetProvincesQuery } from "@/features/auth/api";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { Province } from "@/features/users/user.types";

type OrganizationOptions = {
  label: string;
  value: string;
  province_id?: string;
};

const SelectOrganization = ({ control }: { control: any }) => {
  const [organizationsByProvince, setOrganizationsByProvince] = useState([]);

  const selectProvince = useWatch({
    control,
    name: "provinceId",
  });

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

  React.useEffect(() => {
    if (provinces && organizations) {
      const filteredOrganizations = organizations?.filter(
        (org: OrganizationOptions) => org?.province_id === selectProvince,
      );

      setOrganizationsByProvince(filteredOrganizations);
    }
  }, [provinces.length, organizations.length, selectProvince]);

  return (
    <div className="space-y-3">
      <FormField
        control={control}
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
                }}
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="organizationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
              Trường<p className="text-red-500">*</p>
            </FormLabel>
            <FormControl>
              <Combobox
                options={organizationsByProvince}
                placeholder="Chọn tổ chức"
                value={field.value ?? ""}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="text-red-500 text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SelectOrganization;
