import { Schema, model, Types } from 'mongoose';

export interface Discussion {
  title: string;
  creator: Types.ObjectId;
  body: string;
  creationDate: Date;
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
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  creationDate: {
    type: Date,
    required: true,
  },
});

export default model<Discussion>('Discussion', DiscussionSchema);
