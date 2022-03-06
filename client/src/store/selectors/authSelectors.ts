import { RootState } from '../index';
import { User } from '../../models/user.model';

const getUser = (state: RootState): User | null => {
  return state.authReducer.user;
};

const getUserName = (state: RootState): string | null => {
  const user = state.authReducer.user;
  if (user) {
    return user.name;
  }
  return null;
};

export { getUser, getUserName };
