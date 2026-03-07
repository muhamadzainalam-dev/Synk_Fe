import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  isAuthorized: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    setAuthorized: (state, action) => {
      state.isAuthorized = action.payload;
    },
    clearUser: (state) => {
      state.value = null;
    },
  },
});

export const { setUser, setAuthorized, clearUser } = userSlice.actions;

export default userSlice.reducer;
