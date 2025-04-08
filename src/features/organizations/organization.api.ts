"use client";

import { TypeAddNewOrganization, TypeUpdateOrganization } from "./types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllOrganization: build.query({
      query: (params) => ({
        url: "/organizations",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Organizations"],
    }),
    getOrganization: build.query({
      query: ({ id }) => ({
        url: `/organizations/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Organizations", id }],
    }),
    addNewOrganization: build.mutation({
      query: (data: TypeAddNewOrganization) => ({
        url: "/organizations",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Organizations"];
      },
    }),
    updateOrganization: build.mutation({
      query: (data: TypeUpdateOrganization) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/organizations/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Organizations", "Manager"];
      },
    }),
    deleteOrganization: build.mutation({
      query: ({ id }) => {
        return {
          url: `/organizations/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Organizations"];
      },
    }),
    activeOrganizations: build.mutation({
      query: ({ id }) => {
        return {
          url: `/organizations/${id}/isActive`,
          method: "PATCH",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Organizations"];
      },
    }),
  }),
});

export const {
  useGetAllOrganizationQuery,
  useGetOrganizationQuery,
  useAddNewOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useActiveOrganizationsMutation,
} = authAPI;
