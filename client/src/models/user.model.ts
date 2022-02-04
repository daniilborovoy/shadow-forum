export interface User {
  id: number;
  name: string;
  email: string;
  isActivated: boolean;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

