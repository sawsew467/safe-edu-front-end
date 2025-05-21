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
  }),
});

export const { useGetAllDocumentsQuery, useDeleteDocumentMutation } =
  documentsAPI;
