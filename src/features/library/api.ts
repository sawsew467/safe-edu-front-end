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
      providesTags: ["Library"],
    }),
    getLibrary: build.query({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Library", id }],
    }),
    addNewLibrary: build.mutation({
      query: (data: TypeAddNewLibrary) => ({
        url: "/categories",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: ["Library"],
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
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "Library", id },
      ],
    }),
    deleteLibrary: build.mutation({
      query: ({ id }) => {
        return {
          url: `/categories/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: ["Library"],
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
