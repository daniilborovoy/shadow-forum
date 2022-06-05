import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Box, FormControl, FormGroup, FormLabel, IconButton, InputAdornment, TextField } from '@mui/material';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { authApi } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
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

  const changeEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginRequest((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const changePasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginRequest((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const showPasswordHandler = () => {
    setLoginRequest((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

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
      .catch((err) => {
        console.error(err);
        setLoginRequest((prevState) => ({ ...prevState, password: '' }));
        const message = err.status === 'FETCH_ERROR' ? 'Ошибка сети!' : 'Ошибка входа!';
        enqueueSnackbar(message, {
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
            onChange={changeEmailHandler}
            margin='normal'
            label='Email'
            variant='outlined'
            type='email'
            required
          />

          <TextField
            value={loginRequest.password}
            id='login-password'
            onChange={changePasswordHandler}
            aria-valuemax={32}
            inputProps={{
              maxLength: 32,
              minLength: 8,
            }}
            type={loginRequest.showPassword ? 'text' : 'password'}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={showPasswordHandler}
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
          />
          <LoadingButton
            sx={{ marginTop: '15px', fontWeight: 700 }}
            loading={loginLoading}
            disabled={loginRequest.password.length < 7}
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
