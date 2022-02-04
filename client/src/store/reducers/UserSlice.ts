import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../models/user.model';
import { userApi } from '../../services/user.service';

interface UserState {
  isLoading: boolean;
  isAuth: boolean;
  user?: User;
  error?: string;
}

const initialState: UserState = {
  isLoading: false,
  isAuth: false,
};

const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder => {
    builder.addMatcher(
      userApi.endpoints.fetchUserById.matchFulfilled,
      (state: UserState, { payload }: PayloadAction<UserState>) => {
        state.user = payload.user;
        state.isAuth = payload.isAuth;
        state.isLoading = false;
      },
    );
  }),
});

export default UserSlice.reducer;
