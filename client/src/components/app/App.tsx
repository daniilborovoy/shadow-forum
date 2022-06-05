import React, { FC, useEffect, useState } from 'react';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { io, Socket } from 'socket.io-client';
import AppLoader from '../app-loader/AppLoader';
import { WebSocketProvider } from '../../providers';
import { SnackbarProvider } from 'notistack';

const App: FC = () => {
  const [checkAuth, { isLoading: checkAuthLoading }] = authApi.useRefreshMutation();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    try {
      // check user authorization
      if (localStorage.getItem('shadow-forum/access_token')) {
        checkAuth().catch((err) => console.warn(err));
      }
      // websocket server connection
      const webSocketServerUrl: string = `${window.location.protocol}//${window.location.hostname}:5000`;
      const newSocket = io(webSocketServerUrl);
      setSocket(newSocket);
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (checkAuthLoading) {
    return <AppLoader />;
  }

  return (
    <WebSocketProvider socket={socket}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        dense
      >
        <AppRouter />
      </SnackbarProvider>
    </WebSocketProvider>
  );
};

export default App;
