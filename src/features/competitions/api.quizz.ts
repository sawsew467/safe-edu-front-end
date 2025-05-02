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
    getQuizzByCompetitionId: build.query({
      query: ({ id }) => ({
        url: `/quiz/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Quizz"],
    }),
    isDoQuizz: build.query({
      query: ({ id }) => {
        return {
          url: `/quiz-result/is-submit/${id}`,
          method: "GET",
          flashError: true,
        };
      },
      providesTags: ["Quizz"],
    }),
    getLeaderBoard: build.query({
      query: ({ slug }) => {
        return {
          url: `/competitions/leaderboard/${slug}`,
          method: "GET",
          flashError: true,
        };
      },
    }),
  }),
});

export const {
  useGetAllQuizzQuery,
  useGetQuizzQuery,
  useGetQuizzByCompetitionIdQuery,
  useIsDoQuizzQuery,
  useGetLeaderBoardQuery,
} = QuizzApi;
