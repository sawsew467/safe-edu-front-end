import { baseApi } from "@/redux/baseApi";

export const PictureApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPictureByQuizId: build.query({
      query: ({ id }) => ({
        url: `/picture/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Picture"],
    }),
    getMyPicture: build.query({
      query: ({ id }) => ({
        url: `/picture/my-picture/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Picture"],
    }),
    getPicture: build.query({
      query: ({ id }) => ({
        url: `/picture/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Picture", id }],
    }),
    addNewPicture: build.mutation({
      query: (data) => ({
        url: "/picture/submited",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Picture", "Quizz"];
      },
    }),
    GetAllQuizResultPicture: build.query({
      query: ({ id }) => ({
        url: `/quiz-result/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
    }),
    getPictureByCompetitionId: build.query({
      query: ({ id }) => ({
        url: `/quiz/get-all-by-quizId/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Picture"],
    }),

    gradePicture: build.mutation({
      query: (data) => {
        return {
          url: `/quiz-result/grade-picture`,
          method: "Post",
          body: data,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Picture"];
      },
    }),

    commentPicture: build.mutation({
      query: (data) => {
        return {
          url: `/comments`,
          method: "Post",
          body: data,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Comment"];
      },
    }),

    getAllCommentByPictureId: build.query({
      query: ({ id }) => {
        return {
          url: `/comments/get-by-picture_id/${id}`,
          method: "GET",
          flashError: true,
        };
      },
      providesTags: ["Comment"],
    }),

    deletePicture: build.mutation({
      query: ({ id }) => {
        return {
          url: `/quiz/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Picture"];
      },
    }),
    activePicture: build.mutation({
      query: ({ id }) => {
        return {
          url: `/quiz/${id}/isActive`,
          method: "PATCH",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Picture"];
      },
    }),
  }),
});

export const {
  useGetAllPictureByQuizIdQuery,
  useGetPictureQuery,
  useAddNewPictureMutation,
  useDeletePictureMutation,
  useActivePictureMutation,
  useGetPictureByCompetitionIdQuery,
  useGradePictureMutation,
  useGetAllQuizResultPictureQuery,
  useCommentPictureMutation,
  useGetAllCommentByPictureIdQuery,
  useGetMyPictureQuery,
} = PictureApi;
