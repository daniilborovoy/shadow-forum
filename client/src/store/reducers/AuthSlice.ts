import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import { User } from '../../models/user.model';
import { AuthResponse } from '../../models/auth.model';
import { authApi } from '../../services/auth.service';

interface AuthState {
  isLoading: boolean;
  refreshToken: string | null;
  accessToken: string | null;
  user: User | null;
  error: AuthResponseError | null;
}

interface AuthResponseError {
  message: string;
  error: any;
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
    const isSuccessAuthAction = isAnyOf(authApi.endpoints.login.matchFulfilled, authApi.endpoints.registration.matchFulfilled, authApi.endpoints.refresh.matchFulfilled);
    builder
      .addMatcher(
        isSuccessAuthAction,
        (state: AuthState, action: PayloadAction<AuthResponse>) => {
          localStorage.setItem('token', action.payload.accessToken);
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        })
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state: AuthState) => {
          localStorage.removeItem('token');
          state.refreshToken = null;
          state.accessToken = null;
          state.user = null;
        });
  },
});

export default AuthSlice.reducer;
