import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Discussion } from '../models/discussions.model';
import { baseQueryWithRefresh } from '../http';

export const discussionsApi = createApi({
  reducerPath: 'discussionApi',
  baseQuery: baseQueryWithRefresh,
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
