import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
  name: "Profile",
  initialState: {
    createProfile: {
      currentUser: null,
      error: null,
      loading: false,
    },
  },
  reducers: {
    profileStart: (state) => {
      state.createProfile.loading = false;
    },
    profileSuccess: (state, action) => {
      state.createProfile.currentUser = action.payload.profile;
      state.createProfile.loading = false;
      state.createProfile.error = null;
    },
    profileFailure: (state, action) => {
      state.createProfile.loading = false;
      state.createProfile.error = action.payload;
    },
    resetProfile: (state) => {
      state.createProfile.currentUser = null;
      state.createProfile.error = null;
    },
  },
});

export const { profileStart, profileSuccess, profileFailure, resetProfile } =
  ProfileSlice.actions;

export default ProfileSlice.reducer;
