"use client";

import { baseApi } from "./baseApi.upload";

export const UploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: (body: FormData) => {
        return {
          url: `/categories/upload-image`,
          method: "POST",
          body: body,
          flashError: true,
          formData: true,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = UploadApi;
