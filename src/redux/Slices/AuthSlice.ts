import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const token = localStorage.getItem("OnduToken") as string;

interface AuthState {
  authenticated: boolean;
  token: string;
}

interface Authentication {
  authenticated: boolean;
  token: string;
}

const initialState: AuthState = {
  authenticated: token != null && token != "",
  token: token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Authentication>) => {
      state.authenticated = action.payload.authenticated;
      state.token = action.payload.token;
      localStorage.setItem("OnduToken", action.payload.token);
    },
    logout: (state) => {
      state.authenticated = false;
      localStorage.setItem("OnduToken", "");
    },
  },
});

export const { 
  login,
  logout,
} = authSlice.actions;

export default authSlice.reducer;