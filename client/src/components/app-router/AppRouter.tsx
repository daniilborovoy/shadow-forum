import { Dispatch, SetStateAction, FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home-page/HomePage';
import AuthorizePage from '../../pages/authorize-page/AuthorizePage';
import DiscussionPage from '../../pages/discussion-page/DiscussionPage';
import AccountPage from '../../pages/account-page/AccountPage';
import type { AuthAlert } from '../../models/auth.model';

const AppRouter: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>> }> = ({ setAuthAlert }) => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/authorize' element={<AuthorizePage setAuthAlert={setAuthAlert} />} />
      <Route path='/discussions/:id' element={<DiscussionPage />} />
      <Route path='/account' element={<AccountPage />} />
    </Routes>
  );
};

export default AppRouter;
