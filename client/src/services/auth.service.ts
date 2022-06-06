import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginRequest, RegistrationRequest } from '../models/auth.model';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem('shadow-forum/access_token');
      if (token && endpoint === 'logout') {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registration: builder.mutation<AuthResponse, RegistrationRequest>({
      query: (credentials) => ({
        url: 'registration',
        method: 'POST',
        body: credentials,
      }),
    }),
    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'refresh',
        method: 'GET',
      }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
    }),
  }),
});
