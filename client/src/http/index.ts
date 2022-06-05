import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { authApi } from '../services/auth.service';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { AuthResponse } from '../models/auth.model';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem('shadow-forum/access_token');
    if (token && endpoint !== 'refresh') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

export const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs,
  unknown,
  FetchBaseQueryError> = async (args, api, extraOptions) => {
  let request = await baseQuery(args, api, extraOptions);
  if (request.error && request.error.status === 401) {
    type refreshRequest = QueryReturnValue<AuthResponse, FetchBaseQueryError, FetchBaseQueryMeta>;
    const refresh: refreshRequest = (await baseQuery(
      'refresh',
      api,
      extraOptions,
    )) as refreshRequest;
    if (refresh.data) {
      localStorage.setItem('shadow-forum/access_token', refresh.data.accessToken);
      // repeat our initial request
      request = await baseQuery(args, api, extraOptions);
    } else {
      console.warn('Срок действия refresh токена истёк, необходимо авторизоваться!');
      api.dispatch(authApi.endpoints.logout.initiate());
    }
  }
  return request;
};
