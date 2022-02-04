import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query/react';
import { authApi } from '../services/auth.service';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { AuthResponse } from '../models/authResponse.model';

const API_URL = 'http://localhost:5000/api/';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, {
    endpoint,
  }) => {
    const token = localStorage.getItem('token');
    if (token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    type refreshResult = QueryReturnValue<AuthResponse, FetchBaseQueryError, FetchBaseQueryMeta>;
    const refreshResult = await baseQuery('refresh', api, extraOptions) as refreshResult;
    if (refreshResult.data) {
      // повторяем запрос
      localStorage.setItem('token', refreshResult.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.warn('Срок действия refresh токена истёк, необходимо заново авторизоваться!');
      api.dispatch(authApi.endpoints.logout.initiate());
    }
  }
  return result;
};
