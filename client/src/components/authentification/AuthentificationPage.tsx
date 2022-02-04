import React, { FC, FormEvent, FormEventHandler, useState } from 'react';
import { TextField, Button } from '@mui/material';
import AuthSlice from '../../store/reducers/AuthSlice';
import { useAppDispatch } from '../../hooks/redux';
import { LoginData, RegistrationData } from '../../models/user.model';
import { authApi } from '../../services/auth.service';
import { LoginRequest, RegistrationRequest } from '../../models/authResponse.model';

const AuthentificationPage: FC = () => {

  const [value, setValue] = useState<string>('');
  const [login, { isLoading: loginLoading }] = authApi.useLoginMutation();
  const [registration, { isLoading: registrationLoading }] = authApi.useRegistrationMutation();

  const dispatch = useAppDispatch();

  const submitHandler = async (event: any) => {
    event.preventDefault();
    const userData: RegistrationRequest = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };
    await registration(userData);
  };

  const loginHandler = async (event: any) => {
    event.preventDefault();
    const userData: LoginRequest = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    await login(userData);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <TextField id='name' label='Имя' variant='outlined' type='name' />
        <TextField id='email' label='Email' variant='outlined' type='email' />
        <TextField id='password' label='Пароль' variant='outlined' type='password' />
        <Button variant='contained' type='submit'>Зарегестрироваться</Button>
      </form>
      <form onSubmit={loginHandler}>
        <TextField id='email' label='Email' variant='outlined' type='email' />
        <TextField id='password' label='Пароль' variant='outlined' type='password' />
        <Button variant='contained' type='submit'>Войти</Button>
      </form>
    </div>
  );
};

export default AuthentificationPage;
