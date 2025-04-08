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
  }),
});

export const {
  useLoginWithGoogleMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetProvincesQuery,
  useGetOrganizationsQuery,
} = authAPI;
