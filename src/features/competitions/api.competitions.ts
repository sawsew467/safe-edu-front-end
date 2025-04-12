"use client";

import { baseApi } from "@/redux/baseApi";

export const competitionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCompetitions: build.query({
      query: (params) => ({
        url: "/competitions",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Competitions"],
    }),
    getCompetitions: build.query({
      query: ({ id }) => ({
        url: `/competitions/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Competitions", id }],
    }),
    addNewCompetitions: build.mutation({
      query: (data) => ({
        url: "/competitions",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Competitions"];
      },
    }),
    updateCompetitions: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/competitions/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Competitions"];
      },
    }),
    deleteCompetitions: build.mutation({
      query: ({ id }) => {
        return {
          url: `/competitions/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Competitions"];
      },
    }),
    activeCompetitions: build.mutation({
      query: ({ id }) => {
        return {
          url: `/competitions/${id}/isActive`,
          method: "PATCH",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Competitions"];
      },
    }),
  }),
});

export const {
  useGetAllCompetitionsQuery,
  useGetCompetitionsQuery,
  useAddNewCompetitionsMutation,
  useUpdateCompetitionsMutation,
  useDeleteCompetitionsMutation,
  useActiveCompetitionsMutation,
} = competitionsApi;
