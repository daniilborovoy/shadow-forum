import React, { FC, FormEvent, useRef, useState } from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { authApi } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';
import { useEnqueueSnackbar } from '../../../hooks/useEnqueueSnackbar';
import { useNavigate } from 'react-router-dom';

const LoginForm: FC = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();
  const [login, { isLoading: loginLoading, error: loginError }] = authApi.useLoginMutation();
  const [loginRequest, setLoginRequest] = useState<LoginRequest>({
    email: '',
    password: '',
    showPassword: false,
  });

  const loginHandler = (event: FormEvent): void => {
    event.preventDefault();
    const userData: LoginRequest = {
      email: loginRequest.email,
      password: loginRequest.password,
    };
    login(userData)
      .unwrap()
      .then(() => {
        navigate('/');
        enqueueSnackbar('Успешный вход!', {
          variant: 'success',
        });
      })
      .catch(() => {
        setLoginRequest((prevState) => ({ ...prevState, password: '' }));
        enqueueSnackbar('Ошибка входа!', {
          variant: 'error',
        });
      });
  };

  return (
    <Box component='form' method='POST' style={{ padding: '0 15px' }} onSubmit={loginHandler}>
      <FormControl>
        <FormGroup>
          <FormLabel sx={{ textAlign: 'center' }}>Вход</FormLabel>
          <TextField
            id='login-email'
            value={loginRequest.email}
            onChange={(e) => {
              setLoginRequest((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
            error={Boolean(loginError)}
            margin='normal'
            label='Email'
            variant='outlined'
            type='email'
            required
          />

          <TextField
            value={loginRequest.password}
            id='login-password'
            onChange={(e) => {
              setLoginRequest((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
            type={loginRequest.showPassword ? 'text' : 'password'}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() =>
                      setLoginRequest((prev) => ({
                        ...prev,
                        showPassword: !prev.showPassword,
                      }))
                    }
                    edge='end'
                  >
                    {loginRequest.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            margin='dense'
            label='Пароль'
            variant='outlined'
            error={Boolean(loginError)}
            helperText={loginError && 'Неверный логин или пароль.'}
          />
          <LoadingButton
            sx={{ marginTop: '15px' }}
            loading={loginLoading}
            loadingPosition='start'
            startIcon={<Login />}
            variant='contained'
            type='submit'
          >
            {loginLoading ? 'Входим' : 'Войти'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default LoginForm;
