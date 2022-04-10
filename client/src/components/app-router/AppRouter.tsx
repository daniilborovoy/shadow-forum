import { Dispatch, SetStateAction, FC, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home-page/HomePage';
import AuthorizePage from '../../pages/authorize-page/AuthorizePage';
import DiscussionPage from '../../pages/discussion-page/DiscussionPage';
import AccountPage from '../../pages/account-page/AccountPage';
import type { AuthAlert } from '../../models/auth.model';
import { Socket } from 'socket.io-client';
import { CircularProgress } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';

const NotFoundPage = lazy(() => import('../../pages/not-found/NotFound'));
const notFound =
  <Suspense fallback={<CircularProgress />}>
    <NotFoundPage message={'Проверьте правописание.'} />
  </Suspense>;

const AppRouter: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>>, socket: Socket }> = ({
                                                                                                setAuthAlert,
                                                                                                socket,
                                                                                              }) => {
  const user = useAppSelector(getUser);
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      {!user && <Route path='/authorize' element={<AuthorizePage setAuthAlert={setAuthAlert} />} />}
      <Route path='/discussions/:id' element={<DiscussionPage socket={socket} />} />
      {user && <Route path='/account' element={<AccountPage user={user} />} />}
      <Route path='*' element={notFound} />
    </Routes>
  );
};

export default AppRouter;
