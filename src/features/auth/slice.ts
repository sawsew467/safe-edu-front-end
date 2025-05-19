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
  organization_list:
    | {
        id: string;
        name: string;
      }[]
    | null;
  current_organization: {
    id: string;
    name: string;
  } | null;
}

const initialState: AuthSliceInterface = {
  userInfo: (() => {
    try {
      const userInfo = getClientCookie(constants.USER_INFO) || null;

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
  organization_list: (() => {
    const organization_list =
      getClientCookie(constants.ORGANIZATION_LIST) || null;

    return organization_list ? JSON.parse(organization_list) : null;
  })(),
  current_organization: (() => {
    const current_organization =
      getClientCookie(constants.CURRENT_ORGANIZATION) || null;

    return current_organization ? JSON.parse(current_organization) : null;
  })(),
};

export const authSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setOrganizationList: (state, action) => {
      if (!action.payload?.length) return;

      state.organization_list = action.payload;
      state.current_organization = action.payload[0];
      setClientCookie(
        constants.ORGANIZATION_LIST,
        JSON.stringify(action.payload)
      );
      setClientCookie(
        constants.CURRENT_ORGANIZATION,
        JSON.stringify(action.payload[0])
      );
    },
    setCurrentOrganization: (state, action) => {
      state.current_organization = action.payload;
      setClientCookie(
        constants.CURRENT_ORGANIZATION,
        JSON.stringify(action.payload)
      );
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
      if (
        state.user_role?.role === "Student" ||
        state.user_role?.role === "Citizen"
      )
        setClientCookie(constants.ACCESS_TOKEN, action.payload);
      else {
        console.log("🚀 ~ setAccessToken: ~ action.payload:", action.payload);

        setClientCookie(constants.ACCESS_TOKEN_ADMIN, action.payload);
      }
    },
    setRefreshToken: (state, action) => {
      state.refresh_token = action.payload;
      if (
        state.user_role?.role === "Student" ||
        state.user_role?.role === "Citizen"
      )
        setClientCookie(constants.REFRESH_TOKEN, action.payload);
      else setClientCookie(constants.REFRESH_TOKEN_ADMIN, action.payload);
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

export const {
  setUserInfo,
  setAccessToken,
  setRefreshToken,
  setUserRole,
  setOrganizationList,
  setCurrentOrganization,
} = authSlice.actions;

export default authSlice.reducer;
