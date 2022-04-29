import { User } from './user.model';

interface MessageResponse {
  messageId: string;
  createdBy: User;
  body: string;
  creationDate: Date;
}

interface MessageRequest {
  message: string;
  discussionId: string;
}

export type { MessageResponse, MessageRequest };
