"use client";

import { baseApi } from "@/redux/baseApi";

export const reportAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createReport: build.mutation({
      query: (data) => ({
        url: "/reports",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: ["Reports"],
    }),

    getMyReportById: build.query({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, id) => [{ type: "Reports", id }],
    }),

    getMyReports: build.query({
      query: (params) => ({
        url: "/reports/my-reports",
        method: "GET",
        params,
        flashError: true,
      }),
      providesTags: ["Reports"],
    }),

    updateReportEvidence: build.mutation({
      query: ({ id, data }) => ({
        url: `/reports/${id}/evidence`,
        method: "PATCH",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reports", id }],
    }),

    updateReportAdditionalDetails: build.mutation({
      query: ({ id, additionalDetails }) => ({
        url: `/reports/${id}/additional-details`,
        method: "PATCH",
        body: { additional_details: additionalDetails },
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reports", id }],
    }),
  }),
});

export const {
  useCreateReportMutation,
  useGetMyReportByIdQuery,
  useGetMyReportsQuery,
  useUpdateReportEvidenceMutation,
  useUpdateReportAdditionalDetailsMutation,
} = reportAPI;
