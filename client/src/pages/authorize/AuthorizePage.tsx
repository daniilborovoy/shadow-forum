import { FC, useEffect } from 'react';
import { Box, Divider, Grid } from '@mui/material';
import setPageTitle from '../../utils/SetPageTitle';
import RegistrationForm from '../../components/forms/registration/RegistrationForm';
import LoginForm from '../../components/forms/login/LoginForm';

const AuthorizePage: FC = () => {
  useEffect(() => {
    setPageTitle('Авторизация');
  }, []);

  return (
    <Box>
      <Grid
        sx={{ width: '100%', minHeight: '100vh', padding: '79px 15px' }}
        container
        display='flex'
        direction={{ xs: 'column', sm: 'row' }}
      >
        <Grid
          xs={6}
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoginForm />
        </Grid>
        <Divider flexItem sx={{ margin: '50px 0' }} />
        <Grid
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          xs={6}
          item
        >
          <RegistrationForm />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthorizePage;
