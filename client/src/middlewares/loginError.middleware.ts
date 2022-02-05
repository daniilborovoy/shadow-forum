import {
  MiddlewareAPI,
  isRejectedWithValue,
  Middleware,
} from '@reduxjs/toolkit';

export const unexpectedErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => async (action) => {
    if (isRejectedWithValue(action)) {
      if (action.payload.status === 400) {
        console.warn('Неккоректный запрос!', action.payload);
      } else {
        console.warn('Непредвиденная ошибка!', action.payload);
      }
    }
    return next(action);
  };
