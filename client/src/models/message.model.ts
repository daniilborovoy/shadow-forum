interface MessageResponse {
  userId: string;
  creationDate: Date;
  body: string;
}

interface MessageRequest {
  message: string;
  discussionId: string;
}

export type { MessageResponse, MessageRequest };
