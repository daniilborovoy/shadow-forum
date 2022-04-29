import { FC, useEffect, useState } from 'react';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { io, Socket } from 'socket.io-client';
import AppLoader from '../app-loader/AppLoader';

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
    return <AppRouter socket={socket} />;
  }
  return null;
};

export default App;
