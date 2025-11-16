import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  iv: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      console.log("authSlice: Setting credentials", action.payload);
      state.token = action.payload.token;
      state.iv = action.payload.iv;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    },
    clearCredentials(state) {
      console.log("authSlice: Clearing credentials");
      state.token = null;
      state.iv = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;


// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectProfileImage = (state) => state.auth.user?.profileImage;
export const selectUserPermissions = (state) => state.auth.user?.permissions;
