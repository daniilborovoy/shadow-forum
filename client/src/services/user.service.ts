import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../models/user.model';
import { baseQueryWithRefresh } from '../http';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    fetchUserById: build.query<User, string>({
      query: (userId: string) => ({
        url: `users/${userId}`,
      }),
    }),
    fetchAllUsers: build.mutation<User, void>({
      query: () => ({
        url: 'users',
      }),
    }),
  }),
});
