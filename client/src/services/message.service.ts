import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '../models/user.model';
import { Discussion } from '../models/discussions.model';
import { RootState } from '../store';

const API_URL = 'http://localhost:5000/api/';

export const messagesApi = createApi({
  reducerPath: 'discussionsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, use that for authenticated requests
      const token = (getState() as RootState).authReducer.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    fetchMessagesByDiscussionId: build.query<Discussion, string>({
      query: (discussionId: string) => ({
        url: `messages/${discussionId}`,
      }),
    }),
    sendMessage: build.mutation<Discussion, string>({
      query: (discussionId: string) => ({
        url: `messages`,
        method: 'POST',
        body: {
          id: discussionId,
        },
      }),
    }),
    editMessage: build.mutation<Discussion, string>({
      query: (discussionId: string) => ({
        url: `messages`,
        method: 'PUT',
        body: {
          id: discussionId,
          body: 'in porgress',
        },
      }),
    }),
    deleteMessage: build.mutation<Discussion, string>({
      query: (messageId: string) => ({
        url: `messages`,
        method: 'DELETE',
        body: {
          id: messageId,
        },
      }),
    }),
  }),
});
