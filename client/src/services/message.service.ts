import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '../http';
import { MessageResponse, MessageRequest } from '../models/message.model';

export const messagesApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    fetchMessagesByDiscussionId: build.query<MessageResponse[] | null, string | null>({
      query: (discussionId: string | null) => ({
        url: `messages/${discussionId}`,
      }),
    }),
    sendMessage: build.mutation<MessageResponse, MessageRequest>({
      query: (userMessage: MessageRequest) => ({
        url: `messages`,
        method: 'POST',
        body: {
          message: userMessage.message,
          discussionId: userMessage.discussionId,
        },
      }),
    }),
    editMessage: build.mutation<MessageResponse, string>({
      query: (discussionId: string) => ({
        url: `messages`,
        method: 'PUT',
        body: {
          id: discussionId,
          body: 'in porgress',
        },
      }),
    }),
    deleteMessage: build.mutation<MessageResponse, string>({
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
