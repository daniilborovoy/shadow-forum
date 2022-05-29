import { Schema, model } from 'mongoose';

export type userTheme = 'dark' | 'light' | 'system';

export interface User {
  name: string;
  email: string;
  password: string;
  creationDate: Date;
  isActivated: boolean;
  avatar?: string;
  activationLink?: string;
  userTheme: userTheme;
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
  avatar: { type: String },
  userTheme: {
    type: String,
    default: 'system',
  },
});

export default model<User>('User', UserSchema);
