"use client";

import { TypeAddNewLibrary, TypeUpdateLibrary } from "./library.type";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLibrary: build.query({
      query: (params) => ({
        url: "/categories",
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getLibrary: build.query({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "GET",
        flashError: true,
      }),
    }),
    addNewLibrary: build.mutation({
      query: (data: TypeAddNewLibrary) => ({
        url: "/categories",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    updateLibrary: build.mutation({
      query: (data: TypeUpdateLibrary) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/categories/${id}`,
          method: "PUT",
          body: body,
          flashError: true,
        };
      },
    }),
    deleteLibrary: build.mutation({
      query: ({ id }) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
    }),
  }),
});

export const {
  useGetAllLibraryQuery,
  useGetLibraryQuery,
  useAddNewLibraryMutation,
  useUpdateLibraryMutation,
  useDeleteLibraryMutation,
} = authAPI;
