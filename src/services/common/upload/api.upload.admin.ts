"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie(constants.ACCESS_TOKEN_ADMIN);
    const currentOrganizationRaw = getClientCookie(
      constants.CURRENT_ORGANIZATION,
    );
    const currentOrganization = currentOrganizationRaw
      ? JSON.parse(currentOrganizationRaw)
      : null;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (currentOrganization) {
      headers.set("OrganizationId", `${currentOrganization.id}`);
    }

    return headers;
  },
});

export const UploadAdminApi = createApi({
  reducerPath: "uploadAdminApi",
  baseQuery: baseQuery,
  tagTypes: ["Admin"],
  endpoints: (build) => ({
    importAdminsFromExcel: build.mutation({
      query: (formData: FormData) => {
        return {
          url: `/admin/import-excel`,
          method: "POST",
          body: formData,
          flashError: true,
          formData: true,
        };
      },
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const { useImportAdminsFromExcelMutation } = UploadAdminApi;
