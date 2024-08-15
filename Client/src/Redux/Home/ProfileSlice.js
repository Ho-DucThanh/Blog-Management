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
      state.createProfile.loading = true;
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
  },
});

export const { profileStart, profileSuccess, profileFailure } =
  ProfileSlice.actions;

export default ProfileSlice.reducer;
