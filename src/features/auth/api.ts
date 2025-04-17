"use client";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    sendOtp: build.mutation({
      query: (data) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: data,
      }),
    }),
    signIn: build.mutation({
      query: (data) => ({
        url: "/auth/sign-in",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: build.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    getProvinces: build.query({
      query: () => ({
        url: "/provinces/provinces",
        method: "GET",
      }),
    }),
    getOrganizations: build.query({
      query: () => ({
        url: "/organizations",
        method: "GET",
      }),
    }),
    createCitizenAccount: build.mutation({
      query: (data) => ({
        url: "/auth/sign-up-with-citizen",
        method: "POST",
        body: data,
      }),
    }),
    createStudentAccount: build.mutation({
      query: (data) => ({
        url: "/auth/sign-up-with-student",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetProvincesQuery,
  useGetOrganizationsQuery,
  useCreateCitizenAccountMutation,
  useCreateStudentAccountMutation,
  useSignInMutation,
} = authAPI;
