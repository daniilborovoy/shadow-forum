import { createApi, fetchBaseQuery, FetchBaseQueryMeta } from '@reduxjs/toolkit/query/react';
import { AuthResponse, RegistrationRequest, LoginRequest } from '../models/authResponse.model';
import { RootState } from '../store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    credentials: 'include',
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem('token');
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
