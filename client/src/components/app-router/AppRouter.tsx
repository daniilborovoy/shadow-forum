import { FC, lazy, Suspense, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home/HomePage';
import DiscussionPage from '../../pages/discussion/DiscussionPage';
import type { AuthAlert } from '../../models/auth.model';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';
import Header from '../header/Header';
import AppLoader from '../app-loader/AppLoader';
import Footer from '../footer/Footer';
import AuthorizationAlert from '../authorization-alert/AuthorizationAlert';

const NotFoundPage = lazy(() => import('../../pages/not-found/NotFound'));
const AuthorizePage = lazy(() => import('../../pages/authorize/AuthorizePage'));
const AccountPage = lazy(() => import('../../pages/account/AccountPage'));
const EmailActivation = lazy(() => import('../../pages/email-activation/EmailActivation'));

const emailActivation = (
  <Suspense fallback={<AppLoader />}>
    <EmailActivation />
  </Suspense>
);

const notFound = (
  <Suspense fallback={<AppLoader />}>
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
          <Route
            path='/authorize'
            element={
              <Suspense fallback={<AppLoader />}>
                <AuthorizePage setAuthAlert={setAuthAlert} />
              </Suspense>
            }
          />
        )}
        <Route path='/discussions/:id' element={<DiscussionPage socket={socket} />} />
        {user && (
          <Route
            path='/account'
            element={
              <Suspense fallback={<AppLoader />}>
                <AccountPage user={user} />
              </Suspense>
            }
          />
        )}
        <Route path='/activation/:uuid' element={emailActivation} />
        <Route path='*' element={notFound} />
      </Routes>
      <Footer />
      <AuthorizationAlert authAlert={authAlert} setAuthAlert={setAuthAlert} />
    </BrowserRouter>
  );
};

export default AppRouter;
