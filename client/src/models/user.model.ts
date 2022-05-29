export type userTheme = 'dark' | 'light' | 'system';

interface User {
  _id: string;
  id: string; // TODO
  name: string;
  email: string;
  userTheme: userTheme;
  isActivated: boolean;
  avatar?: string;
}

export type { User };
