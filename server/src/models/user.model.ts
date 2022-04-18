import { Schema, model } from 'mongoose';

export type userTheme = 'dark' | 'light' | 'none';

export interface User {
  name: string;
  email: string;
  password: string;
  creationDate: Date;
  isActivated: boolean;
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
  userTheme: {
    type: String,
    default: 'none',
  },
});

export default model<User>('User', UserSchema);
