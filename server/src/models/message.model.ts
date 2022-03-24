import { Schema, model, Types } from 'mongoose';

export interface Message {
  creatorId: Types.ObjectId;
  discussionId: Types.ObjectId;
  body: string;
  creationDate: Date;
}

const MessageSchema = new Schema<Message>({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  discussionId: {
    type: Schema.Types.ObjectId,
    ref: 'Discussion',
  },
  body: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
});

export default model<Message>('Message', MessageSchema);
