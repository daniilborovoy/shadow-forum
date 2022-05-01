import React, { FC, FormEvent, useState } from 'react';
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
import { RegistrationRequest } from '../../../models/auth.model';
import { authApi } from '../../../services/auth.service';
import { useSnackbar } from 'notistack';
import { useEnqueueSnackbar } from '../../../hooks/useEnqueueSnackbar';

const RegistrationForm: FC = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
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
        enqueueSnackbar('Успешная регистрация!', {
          variant: 'success',
        });
        enqueueSnackbar(
          `Письмо с ссылкой для активации было отправлено на почту ${userData.email}.`,
          {
            variant: 'info',
          },
        );
        window.history.go(-1);
      })
      .catch(() => {
        console.log(registrationError);
        enqueueSnackbar('Ошибка при регистрации!', {
          variant: 'error',
        });
      });
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
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            value={registrationRequest.name}
            onChange={(e) => {
              setRegistrationRequest((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            label='Имя'
            variant='outlined'
            type='text'
            required={true}
          />
          <TextField
            value={registrationRequest.email}
            onChange={(e) => {
              setRegistrationRequest((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
            margin='normal'
            label='Email'
            variant='outlined'
            type='email'
            required={true}
          />
          <FormHelperText>Мы никогда не передадим кому-либо вашу электронную почту.</FormHelperText>
          <TextField
            value={registrationRequest.password}
            onChange={(e) => {
              setRegistrationRequest((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
            margin='normal'
            label='Пароль'
            variant='outlined'
            type={registrationRequest.showPassword ? 'text' : 'password'}
            required={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() =>
                      setRegistrationRequest((prev) => ({
                        ...prev,
                        showPassword: !prev.showPassword,
                      }))
                    }
                    edge='end'
                  >
                    {registrationRequest.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            sx={{ marginTop: '15px' }}
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
