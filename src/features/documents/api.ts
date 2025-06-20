"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";

export const documentsAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    getAllDocuments: build.query({
      query: (params) => ({
        url: "/document-files",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Documents"],
    }),
    deleteDocument: build.mutation({
      query: (id) => ({
        url: `/document-files/${id}`,
        method: "DELETE",
        flashError: true,
      }),
      invalidatesTags: ["Documents"],
    }),
    updateDocument: build.mutation({
      query: (data) => ({
        url: `/document-files/${data.id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} = documentsAPI;
