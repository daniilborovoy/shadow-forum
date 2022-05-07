import { createApi } from '@reduxjs/toolkit/query/react';
import {
  DiscussionRequest,
  DiscussionResponse,
  DiscussionsListResponse,
} from '../models/discussion.model';
import { baseQueryWithRefresh } from '../http';
import { FetchArgs } from '@reduxjs/toolkit/dist/query/react';

interface IFetchAllDiscussions {
  limit: number | void;
  title: string | void;
}

export const discussionsApi = createApi({
  reducerPath: 'discussionApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    fetchDiscussionById: build.query<DiscussionResponse, string | null>({
      query: (id: string) => ({
        url: `discussions/${id}`,
      }),
    }),
    fetchAllDiscussions: build.query<DiscussionResponse[], IFetchAllDiscussions>({
      query: ({ limit, title }: IFetchAllDiscussions) => ({
        url: 'discussions',
        params: {
          _limit: limit,
          title,
        },
      }),
    }),
    fetchMyDiscussions: build.query<DiscussionResponse[], null>({
      query: () => ({
        url: 'discussions/me',
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
    deleteDiscussion: build.mutation<DiscussionResponse, string>({
      query: (discussionId: string) => ({
        url: 'discussions',
        method: 'DELETE',
        params: {
          id: discussionId,
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
    fetchDiscussionsList: build.query<DiscussionsListResponse[], void>({
      query: () => ({
        url: 'discussions-list',
        method: 'GET',
      }),
    }),
  }),
});
