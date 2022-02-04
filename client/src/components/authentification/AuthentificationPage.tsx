import React, { FC, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useAppDispatch } from '../../hooks/redux';
import { authApi } from '../../services/auth.service';
import { LoginRequest, RegistrationRequest } from '../../models/authResponse.model';
import { userApi } from '../../services/user.service';

const AuthentificationPage: FC = () => {

  const [value, setValue] = useState<string>('');
  const [login, { isLoading: loginLoading }] = authApi.useLoginMutation();
  const [registration, { isLoading: registrationLoading }] = authApi.useRegistrationMutation();
  const [logout, { isLoading: logoutLoading }] = authApi.useLogoutMutation();
  const [fetchUsers] = userApi.useFetchAllUsersMutation();

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

  const logoutHandler = async () => {
    await logout();
  };
  const usersHandler = async () => {
    await fetchUsers();
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
      <Button variant='contained' onClick={logoutHandler}>ВЫЙТИ</Button>
      <Button variant='contained' onClick={usersHandler}>Скачать юзеров</Button>
    </div>
  );
};

export default AuthentificationPage;
