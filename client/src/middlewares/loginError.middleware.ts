import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit';

export const unexpectedErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => async (action) => {
    if (isRejectedWithValue(action)) {
      console.warn('Непредвиденная ошибка!', action.payload);
    }
    return next(action);
  };
