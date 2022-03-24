import React, { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react';
import {
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
import { AuthAlert, LoginRequest } from '../../../models/auth.model';

const LoginForm: FC<{ setAuthAlert: Dispatch<SetStateAction<AuthAlert>> }> = ({ setAuthAlert }) => {

  const [login, {
    isLoading: loginLoading,
    error: loginError,
  }] = authApi.useLoginMutation();

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
        setAuthAlert({
          showMessage: true,
          message: 'Успешный вход!',
        });
        window.history.go(-1);
        return;
      })
      .catch(() => {
        return;
      });
  };

  return (
    <form method='POST' style={{padding: '0 15px'}} onSubmit={loginHandler}>
      <FormControl>
        <FormGroup>
          <FormLabel sx={{ textAlign: 'center' }}>Вход</FormLabel>
          <TextField value={loginRequest.email} onChange={(e) => {
            setLoginRequest((prev) => ({
              ...prev,
              email: e.target.value,
            }));
          }}
                     margin='normal'
                     label='Email'
                     variant='outlined'
                     type='email'
                     required={true} />

          <TextField value={loginRequest.password} onChange={(e) => {
            setLoginRequest((prev) => ({
              ...prev,
              password: e.target.value,
            }));
          }}
                     type={loginRequest.showPassword ? 'text' : 'password'}
                     required={true}
                     InputProps={{
                       endAdornment: (
                         <InputAdornment position='end'>
                           <IconButton
                             aria-label='toggle password visibility'
                             onClick={() => setLoginRequest((prev) => ({
                               ...prev,
                               showPassword: !prev.showPassword,
                             }))}
                             edge='end'
                           >
                             {loginRequest.showPassword ? <VisibilityOff /> :
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
            startIcon={<Login />}
            variant='contained'
            type='submit'
          >
            {loginLoading ? 'Входим' : 'Войти'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </form>
  );
};

export default LoginForm;
