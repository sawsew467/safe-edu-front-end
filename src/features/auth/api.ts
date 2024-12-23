"use client";

import { User } from "firebase/auth";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data: User) => ({
        url: "/api/v1/auth/loginWithGoogle",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const { useLoginWithGoogleMutation } = authAPI;
