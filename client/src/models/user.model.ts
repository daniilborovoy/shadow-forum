export type userTheme = 'dark' | 'light' | 'none';

interface User {
  _id: string;
  id: string; // TODO
  name: string;
  email: string;
  userTheme: userTheme;
  isActivated: boolean;
}

export type { User };
