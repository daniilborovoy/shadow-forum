import React, { FC, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../home/HomePage';
import Header from '../header/Header';
import { Container, createTheme, ThemeProvider } from '@mui/material';
import { authApi } from '../../services/auth.service';
import { grey, blue } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';
import AuthorizePage from '../authentification/AuthorizePage';

const App: FC = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: grey[900],
      },
      secondary: {
        main: blue[100],
      },
    },
  });

  const [checkAuth, { isLoading }] = authApi.useRefreshMutation();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      checkAuth();
    }
  }, []);

  if (isLoading) {
    return <LinearProgress color='inherit' />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container>
        <Routes>
          <Route path='/' element={<HomePage />}></Route>
          <Route path='/authorize' element={<AuthorizePage />}></Route>
          <Route path='/discussion/:id' element={null}></Route>
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
