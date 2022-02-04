import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../models/user.model';
import { RootState } from '../store';

const API_URL = 'http://localhost:5000/api/';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState, endpoint,forced }) => {
      console.log(forced);

      // By default, if we have a token in the store, use that for authenticated requests
      const token = (getState() as RootState).authReducer.accessToken;
      if (token && endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    fetchUserById: build.query<User, string>({
      query: (userId: string) => ({
        url: `users/${userId}`,
      }),
    }),
    fetchAllUsers: build.query<User, void>({
      query: () => ({
        url: 'users',
      }),
    }),
  }),
});
