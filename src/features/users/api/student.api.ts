"use client";

import { baseApiAdmin } from "@/redux/admin/baseApi";
import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApiAdmin.injectEndpoints({
  endpoints: (build) => ({
    getAllStudents: build.query({
      query: (params) => ({
        url: "/students",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["students"],
    }),
    getStudentById: build.query({
      query: ({ id }) => ({
        url: `/students/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "students", id }],
    }),

    getStudentByPhone: build.query({
      query: ({ phone }: { phone: string }) => ({
        url: `/students/${phone}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { phone }) => [{ type: "students", phone }],
    }),

    addNewStudent: build.mutation({
      query: (data) => ({
        url: "/students",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
    updateStudent: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/students/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "students", id },
      ],
    }),
    deleteStudents: build.mutation({
      query: ({ id }) => {
        return {
          url: `/students/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
    activeStudents: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/students/${id}/isActive`,
          method: "PATCH",
          flashError: true,
          body: body,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
  }),
});

const UserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query({
      query: () => ({
        url: `/students/get-profile/user`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["students", "citizens"],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: `/students/update-profile`,
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students", "citizens"];
      },
    }),
    changePassword: build.mutation({
      query: (data) => ({
        url: "/students/change-password",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    getStudentByUsername: build.query({
      query: ({ username }) => ({
        url: `/students/username/${username}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "students", id }],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetStudentByUsernameQuery,
} = UserApi;
export const {
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentByPhoneQuery,
  useAddNewStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentsMutation,
  useActiveStudentsMutation,
} = authAPI;
