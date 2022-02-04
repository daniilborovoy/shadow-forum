import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import { userApi } from '../services/user.service';
import { authApi } from '../services/auth.service';
import { discussionsApi } from '../services/discussions.service';
import { messagesApi } from '../services/message.service';
import userReducer from './reducers/UserSlice';
import authReducer from './reducers/AuthSlice';

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [discussionsApi.reducerPath]: discussionsApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([authApi.middleware, userApi.middleware, discussionsApi.middleware, messagesApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
