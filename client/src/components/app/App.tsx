import { FC, useEffect, useState, createContext } from 'react';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { createTheme, LinearProgress } from '@mui/material';
import { grey } from '@mui/material/colors';
import { io, Socket } from 'socket.io-client';
import AppLoader from '../app-loader/AppLoader';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: grey[300],
    },
  },
  typography: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
  },
});

export const PageStyleContext = createContext({
  width: '100%',
  minHeight: '90vh',
  padding: '81px 0',
});

const App: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [checkAuth, { isLoading: checkAuthLoading }] = authApi.useRefreshMutation();

  useEffect(() => {
    if (localStorage.getItem('shadow-forum/access_token')) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const apiUrl = `http://${window.location.hostname}:5000`;
    const newSocket = io(apiUrl);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  if (checkAuthLoading) {
    return <LinearProgress color='inherit' />;
  }

  if (socket) {
    return <AppRouter socket={socket} />;
  }

  return <AppLoader />;
};

export default App;
