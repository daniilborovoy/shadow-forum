import { FC, useEffect, Dispatch, SetStateAction, useContext } from 'react';
import type { AuthAlert } from '../../models/auth.model';
import { Stack, Divider } from '@mui/material';
import setPageTitle from '../../utils/SetPageTitle';
import RegistrationForm from '../../components/forms/registration-form/RegistrationForm';
import LoginForm from '../../components/forms/login-form/LoginForm';
import { PageStyleContext } from '../../components/app/App';

const AuthorizePage: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>> }> = ({ setAuthAlert }) => {
  const pageStyle = useContext(PageStyleContext);

  useEffect(() => {
    setPageTitle('Авторизация');
  }, []);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="center"
      alignItems="center"
      mt={{ xs: 10, sm: 0, md: 0 }}
      spacing={{ xs: 2, sm: 5, md: 15 }}
      divider={<Divider orientation="vertical" flexItem />}
      sx={pageStyle}>
      <LoginForm setAuthAlert={setAuthAlert} />
      <RegistrationForm setAuthAlert={setAuthAlert} />
    </Stack>
  );
};

export default AuthorizePage;
