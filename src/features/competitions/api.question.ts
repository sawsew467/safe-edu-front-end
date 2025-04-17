"use client";

import { baseApi } from "@/redux/baseApi";

export const QuestionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllQuestion: build.query({
      query: (params) => ({
        url: "/questions",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Question"],
    }),
    getQuestion: build.query({
      query: ({ id }) => ({
        url: `/questions/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Question", id }],
    }),
    getQuestionByQuizzId: build.query({
      query: ({ id }) => ({
        url: `/questions/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Question"],
    }),
    submissionQuestion: build.mutation({
      query: (data) => {
        return {
          url: `/submission`,
          method: "POST",
          body: data,
          flashError: true,
        };
      },
    }),
    addNewQuestion: build.mutation({
      query: (data) => ({
        url: "/questions/create-question",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Question"];
      },
    }),
    updateQuestion: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/questions/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Question"];
      },
    }),
    deleteQuestion: build.mutation({
      query: ({ id }) => {
        return {
          url: `/questions/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Question"];
      },
    }),
    activeQuestion: build.mutation({
      query: ({ id }) => {
        return {
          url: `/questions/${id}/isActive`,
          method: "PATCH",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Question"];
      },
    }),
  }),
});

export const {
  useGetAllQuestionQuery,
  useGetQuestionQuery,
  useAddNewQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useActiveQuestionMutation,
  useGetQuestionByQuizzIdQuery,
  useSubmissionQuestionMutation,
} = QuestionApi;
