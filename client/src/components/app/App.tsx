import { FC, useEffect, useState, SyntheticEvent, createContext } from 'react';
import Header from '../header/Header';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { Alert, createTheme, Snackbar, ThemeProvider, LinearProgress } from '@mui/material';
import { grey, blue } from '@mui/material/colors';
import type { AuthAlert } from '../../models/auth.model';
import { io, Socket } from 'socket.io-client';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blue[100],
    },
  },
  typography: {
    fontFamily: ['Montserrat', 'sans-serif'].join(','),
  },
});

export const PageStyleContext = createContext({
  width: '100%',
  minHeight: '90vh',
  padding: '81px 0'
});

const App: FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [checkAuth, { isLoading: checkAuthLoading }] = authApi.useRefreshMutation();
  const [authAlert, setAuthAlert] = useState<AuthAlert>({
    showMessage: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (localStorage.getItem('shadow-forum/access_token')) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  const closeAuthAlertHandler = (event?: SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthAlert((prev) => ({
      ...prev,
      showMessage: false,
    }));
    return;
  };

  if (checkAuthLoading) {
    return <LinearProgress color='inherit' />;
  }

  if (socket) {
    return (
      <ThemeProvider theme={theme}>
        <Header/>
        <AppRouter setAuthAlert={setAuthAlert} socket={socket} />
        <Snackbar open={authAlert.showMessage}
                  autoHideDuration={6000}
                  onClose={closeAuthAlertHandler}>
          <Alert closeText='Закрыть' onClose={closeAuthAlertHandler}
                 severity={authAlert.severity}
                 sx={{ width: '100%' }}>
            {authAlert.message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    );
  }
  return null;
};

export default App;
