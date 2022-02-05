import React, { FC } from 'react';
import { Box } from '@mui/material';
import { discussionsApi } from '../../services/discussions.service';
import { useAppSelector } from '../../hooks/redux';

const HomePage: FC = () => {

  const {
    isLoading: discussionsLoading,
    data: discussions,
  } = discussionsApi.useFetchAllDiscussionsQuery();
  const user = useAppSelector(state => state.authReducer.user);

  const sayDayTime = (name: string | null): string => {
    const currentDate = (new Date()).getHours();
    switch (true) {
      case (currentDate >= 5) && (currentDate < 11):
        return 'Доброе утро' + ` ${name || ''}`;
      case (currentDate >= 11) && (currentDate < 16):
        return 'Добрый день' + ` ${name || ''}`;
      case (currentDate >= 16) && (currentDate <= 23):
        return 'Добрый вечер' + ` ${name || ''}`;
      case (currentDate >= 0) && (currentDate < 5):
        return 'Доброй ночи' + ` ${name || ''}`;
      default:
        return 'Здравствуйте' + ` ${name}`;
    }
  };

  return (
    <Box sx={{paddingTop: '64px'}} alignItems='center' justifyContent='center' textAlign='center'>
      <h1>{sayDayTime(user ? user.name : null)}</h1>
      <h2>Добро пожаловать на SHADOW FORUM</h2>
      {discussionsLoading && <h1>Загрузка обсуждений</h1>}
      <div>{!discussionsLoading && JSON.stringify(discussions)}</div>
    </Box>
  );
};

export default HomePage;
