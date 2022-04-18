import { FC, useEffect, Dispatch, SetStateAction, useContext, useState } from 'react';
import type { AuthAlert } from '../../models/auth.model';
import { Stack, Divider, Grid } from '@mui/material';
import setPageTitle from '../../utils/SetPageTitle';
import RegistrationForm from '../../components/forms/registration-form/RegistrationForm';
import LoginForm from '../../components/forms/login-form/LoginForm';
import { PageStyleContext } from '../../components/app/App';

const AuthorizePage: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>> }> = ({
  setAuthAlert,
}) => {
  const pageStyle = useContext(PageStyleContext);

  useEffect(() => {
    setPageTitle('Авторизация');
  }, []);

  return (
    <Grid
      container
      display='flex'
      direction={{ xs: 'column', sm: 'row' }}
      width='100%'
      sx={pageStyle}
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
        <LoginForm setAuthAlert={setAuthAlert} />
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
        <RegistrationForm setAuthAlert={setAuthAlert} />
      </Grid>
    </Grid>
  );
};

export default AuthorizePage;
