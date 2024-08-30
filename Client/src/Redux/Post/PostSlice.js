import { createSlice } from "@reduxjs/toolkit";

const PostSlice = createSlice({
  name: "post",
  initialState: {
    currentPost: null,
    error: null,
    loading: false,
  },
  reducers: {
    postStart: (state) => {
      state.loading = true;
    },
    postSuccess: (state, action) => {
      state.currentPost = action.payload;
      state.loading = false;
      state.error = null;
    },
    postFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPost: (state) => {
      state.currentPost = null;
      state.error = null;
    },
  },
});

export const { postStart, postSuccess, postFailure, resetPost } =
  PostSlice.actions;
export default PostSlice.reducer;
