"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";
import {
  GenerateSignupLinkRequest,
  GenerateSignupLinkResponse,
  GetActiveSignupLinksResponse,
  RevokeSignupLinkResponse,
  ValidateSignupLinkResponse,
} from "./signup-link.types";

import { baseApi } from "@/redux/baseApi";

export const signupLinkAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    generateSignupLink: build.mutation<
      GenerateSignupLinkResponse,
      GenerateSignupLinkRequest
    >({
      query: (data) => ({
        url: "/organizations/generate-link-sign-up",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];
        return ["Organizations"];
      },
    }),
    getActiveSignupLinks: build.query<GetActiveSignupLinksResponse, void>({
      query: () => ({
        url: "/organizations/signup-links/active",
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Organizations"],
    }),
    getSignupLinkById: build.query<GenerateSignupLinkResponse, string>({
      query: (id) => ({
        url: `/organizations/signup-links/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, id) => [{ type: "Organizations", id }],
    }),
    revokeSignupLink: build.mutation<RevokeSignupLinkResponse, string>({
      query: (id) => ({
        url: `/organizations/signup-links/${id}/revoke`,
        method: "PATCH",
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];
        return ["Organizations"];
      },
    }),
  }),
});

// Public API for validating signup links (no auth required)
export const publicSignupLinkAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    validateSignupLink: build.query<ValidateSignupLinkResponse, string>({
      query: (token) => ({
        url: `/organizations/validate-signup-link/${token}`,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGenerateSignupLinkMutation,
  useGetActiveSignupLinksQuery,
  useGetSignupLinkByIdQuery,
  useRevokeSignupLinkMutation,
} = signupLinkAPI;

export const { useValidateSignupLinkQuery } = publicSignupLinkAPI;
