import { createSlice } from "@reduxjs/toolkit";

import { getClientCookie, setClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { UserRoleBE } from "@/settings/enums";
import { decodeToken } from "@/utils/decode-token";

interface AuthSliceInterface {
  userInfo: {
    displayName: string;
    photoURL: string;
    email: string;
  } | null;
  access_token: string | null;
  refresh_token: string | null;
  user_role: {
    userId: string;
    role: keyof typeof UserRoleBE;
  } | null;
}

const initialState: AuthSliceInterface = {
  userInfo: (() => {
    try {
      const userInfo = getClientCookie(constants.USER_INFO);

      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  })(),
  access_token: getClientCookie(constants.ACCESS_TOKEN) || null,
  refresh_token: getClientCookie(constants.REFRESH_TOKEN) || null,
  user_role: (() => {
    const access_token = getClientCookie(constants.ACCESS_TOKEN) || null;

    if (!access_token) return null;
    const decode_token = decodeToken(access_token);

    if (!decode_token) return null;

    return {
      role: decode_token?.role as keyof typeof UserRoleBE,
      userId: decode_token?.userId,
    };
  })(),
};

export const authSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
      setClientCookie(constants.ACCESS_TOKEN, action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refresh_token = action.payload;
      setClientCookie(constants.REFRESH_TOKEN, action.payload);
    },
    setUserRole: (state, action) => {
      state.user_role = (() => {
        if (!action.payload) return null;
        const decode_token = decodeToken(action.payload);

        if (!decode_token) return null;

        return {
          role: decode_token?.role as keyof typeof UserRoleBE,
          userId: decode_token?.userId,
        };
      })();
    },
  },
  extraReducers: (builder) => {},
});

export const { setUserInfo, setAccessToken, setRefreshToken, setUserRole } =
  authSlice.actions;

export default authSlice.reducer;
