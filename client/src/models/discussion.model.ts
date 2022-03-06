interface DiscussionResponse {
  id: string;
  title: string;
  body: string;
  creationDate: Date;
  viewsCount: number;
  messagesCount: number;
  isCreator: boolean;
}

interface DiscussionRequest {
  title: string;
  body: string;
}

export type { DiscussionRequest, DiscussionResponse };
