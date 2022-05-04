import { createApi } from '@reduxjs/toolkit/query/react';
import { User, userTheme } from '../models/user.model';
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
    changeUserTheme: build.mutation<userTheme, userTheme>({
      query: (theme: userTheme) => ({
        url: 'change-theme',
        method: 'PUT',
        body: {
          theme,
        },
      }),
    }),
    updateUserAvatar: build.mutation<any, FormData>({
      query: (imageFile) => ({
        url: 'avatar',
        method: 'PUT',
        body: imageFile,
      }),
    }),
  }),
});
