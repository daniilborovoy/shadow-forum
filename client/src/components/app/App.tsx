import React, { FC, useEffect, useState } from 'react';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { io, Socket } from 'socket.io-client';
import AppLoader from '../app-loader/AppLoader';
import { CssBaseline, ScopedCssBaseline } from '@mui/material';
import { store } from '../../store';
import { ChosenThemeProvider, ThemeProvider } from '../../providers';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

const App: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [checkAuth, { isLoading: checkAuthLoading }] = authApi.useRefreshMutation();

  useEffect(() => {
    if (localStorage.getItem('shadow-forum/access_token')) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const webSocketServerUrl: string = `${window.location.protocol}//${window.location.hostname}:5000`;
    const newSocket = io(webSocketServerUrl);
    setSocket(newSocket);

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [setSocket]);

  if (checkAuthLoading) {
    return <AppLoader />;
  }

  if (socket) {
    return (
      <ChosenThemeProvider>
        <ThemeProvider>
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            dense
          >
            <AppRouter socket={socket} />
          </SnackbarProvider>
        </ThemeProvider>
      </ChosenThemeProvider>
    );
  }

  return <AppLoader />;
};

export default App;
