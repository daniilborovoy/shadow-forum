import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/user.model';
import { AuthResponse } from '../../models/authResponse.model';
import { authApi } from '../../services/auth.service'

interface AuthState {
  isLoading: boolean;
  refreshToken: string | null;
  accessToken: string | null;
  user: User | null;
  error: AuthResponseError | null;
}

interface AuthResponseError {
  message: string,
  error: any
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  error: null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state: AuthState, action: PayloadAction<AuthResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        })
      .addMatcher(
        authApi.endpoints.registration.matchFulfilled,
        (state: AuthState, action: PayloadAction<AuthResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        })
      .addMatcher(
        authApi.endpoints.refresh.matchFulfilled,
        (state: AuthState, action: PayloadAction<AuthResponse>) => {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        });
  },
});

export default AuthSlice.reducer;
