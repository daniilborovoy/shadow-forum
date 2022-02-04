import React, { FC } from 'react';
import { Container, Box } from '@mui/material';
import AuthentificationPage from '../authentification/AuthentificationPage';
import { discussionsApi } from '../../services/discussions.service';

const HomePage: FC = () => {

  const {
    isLoading: discussionsLoading,
    data: discussions,
  } = discussionsApi.useFetchAllDiscussionsQuery();

  return (
    <Container maxWidth='sm'>
      <Box>
        <h1>Домашняя страница</h1>
        {discussionsLoading && <h1>Загрузка обсуждений</h1>}
        <div>{!discussionsLoading && JSON.stringify(discussions)}</div>
        <AuthentificationPage />
      </Box>
    </Container>
  );
};

export default HomePage;
