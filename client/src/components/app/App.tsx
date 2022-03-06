import { FC, useEffect, useState, SyntheticEvent, createContext } from 'react';
import Header from '../header/Header';
import AppRouter from '../app-router/AppRouter';
import { authApi } from '../../services/auth.service';
import { Alert, createTheme, Snackbar, ThemeProvider, LinearProgress } from '@mui/material';
import { grey, blue } from '@mui/material/colors';
import type { AuthAlert } from '../../models/auth.model';

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
  minHeight: '100vh',
});

const App: FC = () => {

  const [checkAuth, { isLoading: checkAuthLoading }] = authApi.useRefreshMutation();

  const [authAlert, setAuthAlert] = useState<AuthAlert>({
    showMessage: false,
    message: '',
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  const closeAuthAlertHandler = (event?: SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthAlert((prev) => ({
      ...prev,
      showMessage: false,
    }));
  };

  if (checkAuthLoading) {
    return <LinearProgress color='inherit' />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <AppRouter setAuthAlert={setAuthAlert} />
      <Snackbar open={authAlert.showMessage}
                autoHideDuration={6000}
                onClose={closeAuthAlertHandler}>
        <Alert onClose={closeAuthAlertHandler}
               severity='success'
               sx={{ width: '100%' }}>
          {authAlert.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
