import { Schema, model, Types } from 'mongoose';

export interface Token {
  refreshToken: string;
  user: Types.ObjectId;
}

const TokenSchema = new Schema<Token>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

export default model<Token>('Token', TokenSchema);
