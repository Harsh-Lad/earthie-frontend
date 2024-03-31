import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth', // Choose a more descriptive name like 'auth'
  initialState: {
    isLoggedIn: false, // Use a more specific state property name
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true; // Update state on login action
    },
    logout(state) {
      state.isLoggedIn = false; // Update state on logout action
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions; // Destructure actions

export default authSlice.reducer;