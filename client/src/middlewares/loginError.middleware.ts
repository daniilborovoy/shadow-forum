import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit';
import {authApi} from '../services/auth.service';

// export const errorLogger: Middleware =
//   (api: MiddlewareAPI) => (next) => (action) => {
//     // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
//     if (isRejectedWithValue(action)) {
//       console.warn('We got a rejected action!');
//       const [refresh] = authApi.useCheckAuthMutation();
//       refresh()
//     }
//     return next(action);
//   };
