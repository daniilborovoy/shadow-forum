import React, { FC, useState } from 'react';
import { Card, CircularProgress, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DoneIcon from '@mui/icons-material/Done';
import { userApi } from '../../services/user.service';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useAppSelector } from '../../hooks/redux';
import { getUserTheme } from '../../store/selectors/authSelectors';

const SelectThemeButtons: FC = () => {
  const theme = useAppSelector(getUserTheme);
  const [loading, setLoading] = useState<number>(0);
  const [changeThemeQuery] = userApi.useChangeUserThemeMutation();
  const enqueueSnackbar = useEnqueueSnackbar();

  const changeThemeHandler = (newTheme: 'dark' | 'light' | 'system') => () => {
    if (newTheme === theme) return;
    if (newTheme === 'light') {
      setLoading(1);
    } else if (newTheme === 'dark') {
      setLoading(2);
    } else {
      setLoading(3);
    }
    changeThemeQuery(newTheme)
      .unwrap()
      .then(() => {
        enqueueSnackbar('Тема успешно изменена!', {
          variant: 'success',
        });
      })
      .catch(() => {
        enqueueSnackbar('Ошибка при изменении темы!', {
          variant: 'error',
        });
      })
      .finally(() => setLoading(0));
  };

  return (
    <Grid justifyContent='center' container gap={5}>
      <Grid item>
        <Card sx={{ width: '200px', height: '200px', bgcolor: '#fff' }} color='primary'>
          <LoadingButton
            loading={loading === 1}
            loadingIndicator={<CircularProgress color='primary' size={16} />}
            color={theme === 'light' ? 'success' : 'primary'}
            variant={theme === 'light' ? 'outlined' : 'text'}
            onClick={changeThemeHandler('light')}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fff',
              fontWeight: 700,
            }}
          >
            Светлая
            {theme === 'light' && <DoneIcon color='success' />}
          </LoadingButton>
        </Card>
      </Grid>
      <Grid item>
        <Card sx={{ width: '200px', height: '200px', bgcolor: '#000' }} color='primary'>
          <LoadingButton
            loading={loading === 2}
            loadingIndicator={<CircularProgress color='secondary' size={16} />}
            onClick={changeThemeHandler('dark')}
            color={theme === 'dark' ? 'success' : 'secondary'}
            variant={theme === 'dark' ? 'outlined' : 'text'}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              fontWeight: 700,
            }}
          >
            Тёмная
            {theme === 'dark' && <DoneIcon color='success' />}
          </LoadingButton>
        </Card>
      </Grid>
      <Grid item>
        <Card
          sx={{
            width: '200px',
            height: '200px',
            background: 'linear-gradient(45deg, #000000 0%, #222222 46%, #ffffff 100%)',
          }}
        >
          <LoadingButton
            loading={loading === 3}
            loadingIndicator={<CircularProgress color='secondary' size={16} />}
            onClick={changeThemeHandler('system')}
            variant={theme === 'system' ? 'outlined' : 'text'}
            color={theme === 'system' ? 'success' : 'secondary'}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              fontWeight: 700,
            }}
          >
            Системная
            {theme === 'system' && <DoneIcon color='success' />}
          </LoadingButton>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SelectThemeButtons;
