import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { AccountCircle, AppRegistration, Visibility, VisibilityOff } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { RegistrationRequest } from '../../models/auth.model';
import { authApi } from '../../services/auth.service';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useNavigate } from 'react-router-dom';

const RegistrationForm: FC = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();
  const [registration, { isLoading: registrationLoading, error: registrationError }] =
    authApi.useRegistrationMutation();
  const [registrationRequest, setRegistrationRequest] = useState<RegistrationRequest>({
    name: '',
    email: '',
    password: '',
    showPassword: false,
  });

  const registrationHandler = (event: FormEvent): void => {
    event.preventDefault();
    const userData: RegistrationRequest = {
      name: registrationRequest.name,
      email: registrationRequest.email,
      password: registrationRequest.password,
    };
    registration(userData)
      .unwrap()
      .then(() => {
        navigate('/');
        enqueueSnackbar('Успешная регистрация!', {
          variant: 'success',
        });
        enqueueSnackbar(
          `Письмо с ссылкой для активации было отправлено на почту ${userData.email}`,
          {
            variant: 'info',
          },
        );
      })
      .catch((err) => {
        console.error(err);
        setRegistrationRequest(prevState => ({ ...prevState, password: '' }));
        const message = err.status === 'FETCH_ERROR' ? 'Ошибка сети!' : 'Ошибка регистрации!';
        enqueueSnackbar(message, {
          variant: 'error',
        });
      });
  };

  const changePasswordHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRegistrationRequest((prev) => ({
      ...prev,
      password: e.target.value.trim(),
    }));
  };

  const changeNameHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRegistrationRequest((prev) => ({
      ...prev,
      name: e.target.value.trim(),
    }));
  };

  const changeEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setRegistrationRequest((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const showPasswordHandler = () => {
    setRegistrationRequest((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  return (
    <Box
      component='form'
      method='POST'
      style={{ padding: '0 15px' }}
      onSubmit={registrationHandler}
    >
      <FormControl variant='standard'>
        <FormGroup>
          <FormLabel sx={{ textAlign: 'center' }}>Регистрация</FormLabel>
          <TextField
            margin='normal'
            size='medium'
            inputProps={{
              maxLength: 30,
              minLength: 4,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            value={registrationRequest.name}
            onChange={changeNameHandler}
            label='Имя'
            variant='outlined'
            type='text'
            required
          />
          <TextField
            value={registrationRequest.email}
            onChange={changeEmailHandler}
            margin='normal'
            label='Email'
            variant='outlined'
            type='email'
            required
          />
          <FormHelperText>Мы никогда не передадим кому-либо вашу электронную почту.</FormHelperText>
          <TextField
            value={registrationRequest.password}
            onChange={changePasswordHandler}
            margin='normal'
            label='Пароль'
            aria-valuemax={32}
            variant='outlined'
            type={registrationRequest.showPassword ? 'text' : 'password'}
            required
            helperText='Минимум 8 символов'
            inputProps={{
              maxLength: 32,
              minLength: 8,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={showPasswordHandler}
                    edge='end'
                  >
                    {registrationRequest.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            sx={{ marginTop: '15px', fontWeight: 700 }}
            disabled={registrationRequest.password.length < 7}
            loading={registrationLoading}
            loadingPosition='start'
            startIcon={<AppRegistration />}
            variant='contained'
            type='submit'
          >
            {registrationLoading ? 'Регистрация' : 'Зарегестрироваться'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default RegistrationForm;
