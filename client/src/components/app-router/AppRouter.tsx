import { FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/home/HomePage';
import DiscussionPage from '../../pages/discussion/DiscussionPage';
import Header from '../header/Header';
import AppLoader from '../app-loader/AppLoader';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';
import MyDiscussionsPage from '../../pages/my-discussions/MyDiscussionsPage';

const NotFoundPage = lazy(() => import('../../pages/not-found/NotFoundPage'));
const AuthorizePage = lazy(() => import('../../pages/authorize/AuthorizePage'));
const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage'));
const EmailActivationPage = lazy(() => import('../../pages/email-activation/EmailActivationPage'));

const AppRouter: FC = () => {
  const user = useAppSelector(getUser);

  return (
    <Router>
      <Header />
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/discussions/:id' element={<DiscussionPage />} />
          {user ? (
            <>
              <Route path='/settings' element={<SettingsPage user={user} />} />
              <Route path='/my-discussions' element={<MyDiscussionsPage />} />
            </>
          ) : (
            <Route path='/authorize' element={<AuthorizePage />} />
          )}
          <Route path='/activation/:activationLink' element={<EmailActivationPage />} />
          <Route path='*' element={<NotFoundPage message={'Такой страницы не существует.'} />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
