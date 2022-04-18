import { FC, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home-page/HomePage';
import AuthorizePage from '../../pages/authorize-page/AuthorizePage';
import DiscussionPage from '../../pages/discussion-page/DiscussionPage';
import AccountPage from '../../pages/account-page/AccountPage';
import type { AuthAlert } from '../../models/auth.model';
import { Socket } from 'socket.io-client';
import { CircularProgress } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import AuthorizationAlert from '../authorization-alert/AuthorizationAlert';

const NotFoundPage = lazy(() => import('../../pages/not-found/NotFound'));
const notFound = (
  <Suspense fallback={<CircularProgress />}>
    <NotFoundPage message={'Такой страницы не существует.'} />
  </Suspense>
);

const AppRouter: FC<{ socket: Socket }> = ({ socket }) => {
  const user = useAppSelector(getUser);

  const [authAlert, setAuthAlert] = useState<AuthAlert>({
    showMessage: false,
    message: '',
    severity: 'success',
  });

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        {!user && (
          <Route path='/authorize' element={<AuthorizePage setAuthAlert={setAuthAlert} />} />
        )}
        <Route path='/discussions/:id' element={<DiscussionPage socket={socket} />} />
        {user && <Route path='/account' element={<AccountPage user={user} />} />}
        <Route path='*' element={notFound} />
      </Routes>
      <Footer />
      <AuthorizationAlert authAlert={authAlert} setAuthAlert={setAuthAlert} />
    </BrowserRouter>
  );
};

export default AppRouter;
