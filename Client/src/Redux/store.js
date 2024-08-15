import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/AuthSlice";
import profileReducer from "./Home/ProfileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});
