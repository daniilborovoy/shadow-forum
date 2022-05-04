import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import NotFoundImg from './404.svg';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: FC<{ message: string }> = ({ message }) => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true }); // the current entry in the history stack will be replaced with the new one with { replace: true }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '64px 15px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography mt={2} fontSize={30}>
        Упс! Страница не найдена!
      </Typography>
      <Typography sx={{ maxWidth: 600 }}>Описание ошибки: {message}</Typography>
      <Typography sx={{ maxWidth: 600 }}>Обязательно проверьте правописание!</Typography>
      <Box
        component='img'
        src={NotFoundImg}
        alt='404'
        loading='lazy'
        sx={{ width: { xs: 300, sm: 500 }, pointerEvents: 'none', userSelect: 'none' }}
      />
      <Button color='inherit' onClick={goBackHandler} variant='outlined'>
        Вернуться назад
      </Button>
    </Box>
  );
};

export default NotFoundPage;
