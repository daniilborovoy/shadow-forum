import { createApi } from '@reduxjs/toolkit/query/react';
import { DiscussionRequest, DiscussionResponse } from '../models/discussion.model';
import { baseQueryWithRefresh } from '../http';

export const discussionsApi = createApi({
  reducerPath: 'discussionApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    fetchDiscussionById: build.query<DiscussionResponse, string | null>({
      query: (id: string) => ({
        url: `discussions/${id}`,
      }),
    }),
    fetchAllDiscussions: build.query<DiscussionResponse[], number | void>({
      query: (limit: number | void) => ({
        url: 'discussions',
        params: {
          _limit: limit,
        },
      }),
    }),
    fetchMyDiscussions: build.query<DiscussionResponse[], number | void>({
      query: (limit: number | void) => ({
        url: 'discussions/me',
        params: {
          _limit: limit,
        },
      }),
    }),
    createDiscussion: build.mutation<DiscussionResponse, DiscussionRequest>({
      query: (discussionData: DiscussionRequest) => ({
        url: 'discussions',
        method: 'POST',
        body: {
          title: discussionData.title,
          body: discussionData.body,
        },
      }),
    }),
    editDiscussion: build.mutation<DiscussionResponse, DiscussionRequest>({
      query: (discussionData: DiscussionRequest) => ({
        url: 'discussions',
        method: 'PUT',
        body: {
          title: discussionData.title,
          body: discussionData.body,
        },
      }),
    }),
    deleteDiscussion: build.mutation<DiscussionResponse, DiscussionRequest>({
      query: (discussionData: DiscussionRequest) => ({
        url: 'discussions',
        method: 'DELETE',
        body: {
          title: discussionData.title,
          body: discussionData.body,
        },
      }),
    }),
    addView: build.mutation({
      query: (id: string) => ({
        url: 'discussions/viewed',
        method: 'PUT',
        body: {
          id,
        },
      }),
    }),
  }),
});
