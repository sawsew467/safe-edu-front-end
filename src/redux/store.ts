import { configureStore } from "@reduxjs/toolkit";

import { rtkQueryErrorLogger } from "./midleware";
import { baseApi } from "./baseApi";

import auth from "@/features/auth/slice";
import { authAPI } from "@/features/auth/api";
import { baseApi as uploadApi } from "@/services/common/upload/baseApi.upload";
import { UploadApi } from "@/services/common/upload/api.upload";

export const store = configureStore({
  reducer: {
    [UploadApi.reducerPath]: UploadApi.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    auth,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(uploadApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
