"use client";

import { baseApi } from "@/redux/baseApi";

export const QuizzApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllQuizz: build.query({
      query: (params) => ({
        url: "/quiz",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Quizz"],
    }),
    getQuizz: build.query({
      query: ({ id }) => ({
        url: `/quiz/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Quizz", id }],
    }),
    addNewQuizz: build.mutation({
      query: (data) => ({
        url: "/quiz/create-quiz",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Quizz"];
      },
    }),
    getQuizzByCompetitionId: build.query({
      query: ({ id }) => ({
        url: `/quiz/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Quizz"],
    }),
    updateQuizz: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/quiz/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Quizz"];
      },
    }),
    deleteQuizz: build.mutation({
      query: ({ id }) => {
        return {
          url: `/quiz/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Quizz"];
      },
    }),
    activeQuizz: build.mutation({
      query: ({ id }) => {
        return {
          url: `/quiz/${id}/isActive`,
          method: "PATCH",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Quizz"];
      },
    }),
  }),
});

export const {
  useGetAllQuizzQuery,
  useGetQuizzQuery,
  useAddNewQuizzMutation,
  useUpdateQuizzMutation,
  useDeleteQuizzMutation,
  useActiveQuizzMutation,
  useGetQuizzByCompetitionIdQuery,
} = QuizzApi;
