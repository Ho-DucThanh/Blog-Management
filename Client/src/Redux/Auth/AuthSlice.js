import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    login: {
      currentUser: null,
      accessToken: null,
      error: null,
      loading: false,
    },
    register: {
      success: false,
      error: null,
      loading: false,
    },
  },
  reducers: {
    loginStart: (state) => {
      state.login.loading = true;
    },
    loginSuccess: (state, action) => {
      state.login.currentUser = action.payload.user;
      state.login.accessToken = action.payload.accessToken;
      state.login.loading = false;
      state.login.error = null;
    },
    loginFailure: (state, action) => {
      state.login.loading = false;
      state.login.error = action.payload;
    },

    registerStart: (state) => {
      state.register.loading = true;
    },
    registerSuccess: (state, action) => {
      state.register.loading = false;
      state.register.error = null;
      state.register.success = true;
    },
    registerFailure: (state, action) => {
      state.register.loading = false;
      state.register.error = action.payload;
      state.register.success = false;
    },

    logoutSuccess: (state) => {
      state.login.currentUser = null;
      state.login.accessToken = null;
      state.login.loading = false;
      state.login.error = null;
    },
    logoutFailure: (state, action) => {
      state.login.loading = false;
      state.login.error = action.payload;
    },
    logoutStart: (state) => {
      state.login.loading = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} = AuthSlice.actions;

export default AuthSlice.reducer;
