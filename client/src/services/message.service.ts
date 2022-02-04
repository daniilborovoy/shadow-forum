import { createApi } from '@reduxjs/toolkit/query/react';
import { Discussion } from '../models/discussions.model';
import { baseQueryWithRefresh } from '../http';

// TODO Сделать back для клиента
export const messagesApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: baseQueryWithRefresh,
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
