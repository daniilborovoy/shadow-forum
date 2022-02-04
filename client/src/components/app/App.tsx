import React, { FC, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styles from './App.module.scss';
import HomePage from '../home/HomePage';
import Header from '../header/Header';
import { useAppSelector } from '../../hooks/redux';
import { authApi } from '../../services/auth.service';

const App: FC = () => {

  const [checkAuth, { isLoading }] = authApi.useRefreshMutation();
  const {
    user,
    error,
  } = useAppSelector(state => state.authReducer);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.app}>
        Загрузка...
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header />
      <div>{JSON.stringify(user)}</div>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
