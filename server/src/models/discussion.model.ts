import { Schema, model, Types } from 'mongoose';

export interface Discussion {
  title: string;
  creatorId: Types.ObjectId;
  body: string;
  creationDate: Date;
  viewsCount: number;
  messagesCount: number;
}

const DiscussionSchema = new Schema<Discussion>({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  messagesCount: {
    type: Number,
    default: 0,
  },
});

export default model<Discussion>('Discussion', DiscussionSchema);
