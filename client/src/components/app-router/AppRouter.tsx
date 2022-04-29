import { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home/HomePage';
import DiscussionPage from '../../pages/discussion/DiscussionPage';
import Header from '../header/Header';
import AppLoader from '../app-loader/AppLoader';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';

const NotFoundPage = lazy(() => import('../../pages/not-found/NotFoundPage'));
const AuthorizePage = lazy(() => import('../../pages/authorize/AuthorizePage'));
const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage'));
const EmailActivation = lazy(() => import('../../pages/email-activation/EmailActivationPage'));

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
                <AuthorizePage />
              </Suspense>
            }
          />
        )}
        <Route path='/discussions/:id' element={<DiscussionPage socket={socket} />} />
        {user && (
          <Route
            path='/settings'
            element={
              <Suspense fallback={<AppLoader />}>
                <SettingsPage user={user} />
              </Suspense>
            }
          />
        )}
        <Route path='/activation/:activationLink' element={emailActivation} />
        <Route path='*' element={notFound} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
