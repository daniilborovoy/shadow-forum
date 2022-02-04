import { Schema, model, Types } from 'mongoose';

export interface Message {
  creator: Types.ObjectId;
  discussion: Types.ObjectId;
  body: string;
  creationDate: Date;
}

const MessageSchema = new Schema<Message>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  discussion: {
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
