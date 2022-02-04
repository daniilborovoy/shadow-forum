import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Discussion } from '../models/discussions.model';
import { RootState } from '../store';

const API_URL = 'http://localhost:5000/api/';

export const discussionsApi = createApi({
  reducerPath: 'discussionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // By default, if we have a token in the store, use that for authenticated requests
      const token = (getState() as RootState).authReducer.accessToken;
      if (token && endpoint !== 'refresh') {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    fetchDiscussionById: build.query<Discussion, string>({
      query: (id: string) => ({
        url: `discussions/${id}`,
      }),
    }),
    fetchAllDiscussions: build.query<Discussion[], void>({
      query: () => ({
        url: `discussions`,
      }),
    }),
  }),
});
