import React, { FC, useEffect, useState } from 'react';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { io, Socket } from 'socket.io-client';
import AppLoader from '../app-loader/AppLoader';
import { ChosenThemeProvider, ThemeProvider, WebSocketProvider } from '../../providers';
import { SnackbarProvider } from 'notistack';

const App: FC = () => {
  const [checkAuth, { isLoading: checkAuthLoading, error }] = authApi.useRefreshMutation();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem('shadow-forum/access_token')) {
        checkAuth();
      }
      // websocket server connection
      const webSocketServerUrl: string = `${window.location.protocol}//${window.location.hostname}:5000`;
      const newSocket = io(webSocketServerUrl);
      setSocket(newSocket);
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!checkAuthLoading) {
    return (
      <WebSocketProvider socket={socket}>
        <ChosenThemeProvider>
          <ThemeProvider>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              dense
            >
              <AppRouter />
            </SnackbarProvider>
          </ThemeProvider>
        </ChosenThemeProvider>
      </WebSocketProvider>
    );
  }

  return <AppLoader />;
};

export default App;
