import React, { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import NotFoundImg from './404.png';
import { useNavigate } from 'react-router-dom';

const NotFound: FC<{ message: string }> = ({ message }) => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '0 15px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography fontSize={30}>Упс! Страница не найдена!</Typography>
      <Typography sx={{ maxWidth: 600 }}>Описание ошибки: {message}</Typography>
      <Typography sx={{ maxWidth: 600 }}>Обязательно проверьте правописание!</Typography>
      <Box
        component='img'
        src={NotFoundImg}
        alt='Error 404'
        sx={{ width: { xs: 300, sm: 500 }, pointerEvents: 'none', userSelect: 'none' }}
      />
      <Button onClick={goBackHandler} variant='outlined'>
        Вернуться назад
      </Button>
    </Box>
  );
};

export default NotFound;
