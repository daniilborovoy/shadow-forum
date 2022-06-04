import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { User, userTheme } from '../../models/user.model';
import { AuthResponse } from '../../models/auth.model';
import { authApi } from '../../services/auth.service';
import { userApi } from '../../services/user.service';

interface AuthState {
  isLoading: boolean;
  refreshToken: string | null;
  accessToken: string | null;
  userTheme: userTheme;
  user: User | null;
  error: AuthResponseError | null;
}

interface AuthResponseError {
  message: string;
  error: unknown;
}

const initialState: AuthState = {
  isLoading: false,
  accessToken: null,
  refreshToken: null,
  userTheme: 'system',
  user: null,
  error: null,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmailActivationState: (state, action: PayloadAction<boolean>) => {
      if (state.user) state.user.isActivated = action.payload;
    },
  },
  extraReducers: (builder) => {
    const isSuccessAuthAction = isAnyOf(
      authApi.endpoints.login.matchFulfilled,
      authApi.endpoints.registration.matchFulfilled,
      authApi.endpoints.refresh.matchFulfilled,
    );
    builder
      .addMatcher(isSuccessAuthAction, (state: AuthState, action: PayloadAction<AuthResponse>) => {
        localStorage.setItem('shadow-forum/access_token', action.payload.accessToken);
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.userTheme = action.payload.user.userTheme;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state: AuthState) => {
        localStorage.removeItem('shadow-forum/access_token');
        state.refreshToken = null;
        state.accessToken = null;
        state.user = null;
        state.userTheme = 'system';
      })
      .addMatcher(
        userApi.endpoints.changeUserTheme.matchFulfilled,
        (state: AuthState, action: PayloadAction<userTheme>) => {
          state.userTheme = action.payload;
        },
      );
  },
});

export const { setEmailActivationState } = AuthSlice.actions;
export default AuthSlice.reducer;
