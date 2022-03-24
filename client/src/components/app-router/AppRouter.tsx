import { Dispatch, SetStateAction, FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home-page/HomePage';
import AuthorizePage from '../../pages/authorize-page/AuthorizePage';
import DiscussionPage from '../../pages/discussion-page/DiscussionPage';
import AccountPage from '../../pages/account-page/AccountPage';
import type { AuthAlert } from '../../models/auth.model';
import { Socket } from 'socket.io-client';

const AppRouter: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>>, socket: Socket }> = ({
  setAuthAlert,
  socket,
}) => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/authorize' element={<AuthorizePage setAuthAlert={setAuthAlert} />} />
      <Route path='/discussions/:id' element={<DiscussionPage socket={socket} />} />
      <Route path='/account' element={<AccountPage />} />
    </Routes>
  );
};

export default AppRouter;
