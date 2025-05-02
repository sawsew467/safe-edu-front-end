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
  }),
});

export const {
  useGetAllQuestionQuery,
  useGetQuestionQuery,
  useGetQuestionByQuizzIdQuery,
  useSubmissionQuestionMutation,
} = QuestionApi;
