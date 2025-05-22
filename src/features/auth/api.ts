import { use } from 'react';
import { baseApi } from "@/redux/baseApi";
import { verify } from "crypto";

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
        url: "/provinces/all",
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
    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtpForgotPassword: build.mutation({
      query: (data) => ({
        url: "/auth/verify-otp-forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    })
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
  useForgotPasswordMutation,
  useVerifyOtpForgotPasswordMutation,
  useResetPasswordMutation
} = authAPI;
