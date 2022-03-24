interface MessageResponse {
  messageId: string;
  userId: string;
  body: string;
  creationDate: Date;
}

interface MessageRequest {
  message: string;
  discussionId: string;
}

export type { MessageResponse, MessageRequest };
