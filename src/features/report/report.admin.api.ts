"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";

export const reportAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    getReportById: build.query({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, id) => [{ type: "Reports", id }],
    }),

    getAllReports: build.query({
      query: (params) => ({
        url: "/reports",
        method: "GET",
        params,
        flashError: true,
      }),
      providesTags: ["Reports"],
    }),

    getOrganizationReports: build.query({
      query: (params) => ({
        url: "/reports-organization",
        method: "GET",
        params,
        flashError: true,
      }),
      providesTags: ["Reports"],
    }),

    updateReportStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/reports/${id}/status`,
        method: "PATCH",
        body: { status },
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reports", id },
        "Reports",
      ],
    }),

    getEmergencyLogs: build.query({
      query: (params) => ({
        url: "/emergency-logs",
        method: "GET",
        params,
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetReportByIdQuery,
  useGetAllReportsQuery,
  useGetOrganizationReportsQuery,
  useUpdateReportStatusMutation,
  useGetEmergencyLogsQuery,
} = reportAPI;
