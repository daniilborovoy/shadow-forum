import { Schema, model } from 'mongoose';

export interface User {
  name: string;
  email: string;
  password: string;
  creationDate: Date;
  isActivated: boolean;
  activationLink?: string;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  activationLink: { type: String },
});

export default model<User>('User', UserSchema);
