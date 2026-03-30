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
        url: "/signup-links/generate-link-sign-up",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];
        return ["signup-links"];
      },
    }),
    generateAdminSignupLink: build.mutation<
      GenerateSignupLinkResponse,
      GenerateSignupLinkRequest
    >({
      query: (data) => ({
        url: "/signup-links/admin/generate-link-sign-up",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];
        return ["signup-links"];
      },
    }),
    getActiveSignupLinks: build.query<GetActiveSignupLinksResponse, void>({
      query: () => ({
        url: "/signup-links/active",
        method: "GET",
        flashError: true,
      }),
      providesTags: ["signup-links"],
    }),
    getActiveAdminSignupLinks: build.query<GetActiveSignupLinksResponse, void>({
      query: () => ({
        url: "/signup-links/admin/active",
        method: "GET",
        flashError: true,
      }),
      providesTags: ["signup-links"],
    }),
    getSignupLinkById: build.query<GenerateSignupLinkResponse, string>({
      query: (id) => ({
        url: `/signup-links/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, id) => [{ type: "signup-links", id }],
    }),
    revokeSignupLink: build.mutation<RevokeSignupLinkResponse, string>({
      query: (id) => ({
        url: `/signup-links/${id}/revoke`,
        method: "PATCH",
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];
        return ["signup-links"];
      },
    }),
  }),
});

// Public API for validating signup links (no auth required)
export const publicSignupLinkAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    validateSignupLink: build.query<ValidateSignupLinkResponse, string>({
      query: (token) => ({
        url: `/signup-links/validate/${token}`,
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
  useGenerateAdminSignupLinkMutation,
  useGetActiveAdminSignupLinksQuery,
} = signupLinkAPI;

export const { useValidateSignupLinkQuery } = publicSignupLinkAPI;
