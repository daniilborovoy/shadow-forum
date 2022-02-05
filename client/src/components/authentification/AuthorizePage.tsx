import React, { FC, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import {
  TextField,
  FormGroup,
  FormLabel,
  FormHelperText,
  FormControl,
  Stack,
  Container,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import LoginIcon from '@mui/icons-material/Login';
import { AccountCircle } from '@mui/icons-material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { authApi } from '../../services/auth.service';
import { LoginRequest, RegistrationRequest } from '../../models/authResponse.model';
import { useNavigate } from 'react-router-dom';

interface regData {
  name: string;
  email: string;
  password: string;
  showPassword: boolean;
}

interface loginData {
  email: string;
  password: string;
  showPassword: boolean;
}

const AuthorizePage: FC = () => {
  const navigate = useNavigate();
  // TODO добавить типы для авторизации
  const [registration, {
    isLoading: registrationLoading,
    error: registrationError,
  }] = authApi.useRegistrationMutation();

  const [login, {
    isLoading: loginLoading,
    error: loginError,
  }] = authApi.useLoginMutation();

  const [registrationData, setRegistrationData] = useState<regData>({
    name: '',
    email: '',
    password: '',
    showPassword: false,
  });
  const [loginData, setLoginData] = useState<loginData>({
    email: '',
    password: '',
    showPassword: false,
  });

  const registrationHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const userData: RegistrationRequest = {
      name: registrationData.name,
      email: registrationData.email,
      password: registrationData.password,
    };
    registration(userData)
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        return;
      });
  };

  const loginHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const userData: LoginRequest = {
      email: loginData.email,
      password: loginData.password,
    };
    login(userData)
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        return;
      });
  };

  return (
    <Container sx={{
      paddingTop: '64px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}>
      <Stack sx={{
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: '15px',
      }} direction='row' spacing={20}>
        <form method='POST' onSubmit={loginHandler}>
          <FormControl>
            <FormGroup>
              <FormLabel sx={{ textAlign: 'center' }}>Вход</FormLabel>
              <TextField value={loginData.email} onChange={(e) => {
                setLoginData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
                         margin='normal'
                         label='Email'
                         variant='outlined'
                         type='email'
                         required={true} />

              <TextField value={loginData.password} onChange={(e) => {
                setLoginData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
                         type={loginData.showPassword ? 'text' : 'password'}
                         required={true}
                         InputProps={{
                           endAdornment: (
                             <InputAdornment position='end'>
                               <IconButton
                                 aria-label='toggle password visibility'
                                 onClick={() => setLoginData((prev) => ({
                                   ...prev,
                                   showPassword: !prev.showPassword,
                                 }))}
                                 edge='end'
                               >
                                 {loginData.showPassword ? <VisibilityOff /> :
                                   <Visibility />}
                               </IconButton>
                             </InputAdornment>
                           ),
                         }}
                         margin='dense' label='Пароль' variant='outlined'
                         error={Boolean(loginError)}
                         helperText={loginError && 'Неверный пароль.'}>
              </TextField>
              <LoadingButton
                sx={{ marginTop: '15px' }}
                loading={loginLoading}
                loadingPosition='start'
                startIcon={<LoginIcon />}
                variant='contained'
                type='submit'
              >
                {loginLoading ? 'Входим' : 'Вход'}
              </LoadingButton>
            </FormGroup>
          </FormControl>
        </form>

        <form method='POST' onSubmit={registrationHandler}>
          <FormControl variant='standard'>
            <FormGroup>
              <FormLabel sx={{ textAlign: 'center' }}>Регистрация</FormLabel>
              <TextField margin='normal' size='medium' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountCircle />
                  </InputAdornment>
                ),
              }} value={registrationData.name} onChange={(e) => {
                setRegistrationData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }} label='Имя'
                         variant='outlined' type='name' required={true} />
              <TextField value={registrationData.email}
                         onChange={(e) => {
                           setRegistrationData((prev) => ({
                             ...prev,
                             email: e.target.value,
                           }));
                         }}
                         margin='normal' label='Email' variant='outlined' type='email'
                         required={true} />
              <FormHelperText>Мы никогда не передадим кому-либо вашу электронную
                почту.</FormHelperText>
              <TextField value={registrationData.password} onChange={(e) => {
                setRegistrationData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
                         margin='normal' label='Пароль' variant='outlined'
                         type={registrationData.showPassword ? 'text' : 'password'}
                         required={true}
                         InputProps={{
                           endAdornment: (
                             <InputAdornment position='end'>
                               <IconButton
                                 aria-label='toggle password visibility'
                                 onClick={() => setRegistrationData((prev) => ({
                                   ...prev,
                                   showPassword: !prev.showPassword,
                                 }))}
                                 edge='end'
                               >
                                 {registrationData.showPassword ? <VisibilityOff /> :
                                   <Visibility />}
                               </IconButton>
                             </InputAdornment>
                           ),
                         }}
              />
              <LoadingButton
                sx={{ marginTop: '15px' }}
                loading={registrationLoading}
                loadingPosition='start'
                startIcon={<AppRegistrationIcon />}
                variant='contained'
                type='submit'
              >
                {registrationLoading ? 'Регистрация' : 'Зарегестрироваться'}
              </LoadingButton>
            </FormGroup>
          </FormControl>
        </form>
      </Stack>
    </Container>
  );
};

export default AuthorizePage;
