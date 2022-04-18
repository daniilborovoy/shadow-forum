export type userTheme = 'dark' | 'light' | 'none';

interface User {
  id: string;
  name: string;
  email: string;
  userTheme: userTheme;
  isActivated: boolean;
}

export type { User };
