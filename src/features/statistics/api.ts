"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";

export const newsAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    getCountUsers: build.query({
      query: (params) => ({
        url: "/students/count",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCountOrganizations: build.query({
      query: (params) => ({
        url: "/organizations/total",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCountNewsViews: build.query({
      query: (params) => ({
        url: "/news/views/total",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCountLibraryViews: build.query({
      query: (params) => ({
        url: "/categories/views/total",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getVisitStats7Days: build.query({
      query: (params) => ({
        url: "/visit/stats/7days",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCountOrganizationByProvince: build.query({
      query: (params) => ({
        url: "/organizations/count-by-province",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCompetitionMonthlyStats: build.query({
      query: (params) => ({
        url: "/competitions/monthly-stats",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getQuizResultMonthlyStats: build.query({
      query: (params) => ({
        url: "/quiz-result/monthly-stat",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getProvinceStats: build.query({
      query: (params) => ({
        url: "/provinces/stats",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetCountUsersQuery,
  useGetCountOrganizationsQuery,
  useGetCountNewsViewsQuery,
  useGetCountLibraryViewsQuery,
  useGetVisitStats7DaysQuery,
  useGetCountOrganizationByProvinceQuery,
  useGetCompetitionMonthlyStatsQuery,
  useGetQuizResultMonthlyStatsQuery,
  useGetProvinceStatsQuery,
} = newsAPI;
