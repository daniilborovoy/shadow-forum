import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import MyDiscussionsList from '../../components/lists/my-discussions/MyDiscussionsList';
import { discussionsApi } from '../../services/discussions.service';
import MyDiscussionsSkeleton from '../../components/my-discussions-skeleton/MyDiscussionsSkeleton';
import setPageTitle from '../../utils/SetPageTitle';

const MyDiscussionsPage = () => {
  const { data: myDiscussions } = discussionsApi.useFetchMyDiscussionsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    setPageTitle('Мои обсуждения');
  });

  return (
    <Box width='100%' minHeight='100vh' sx={{ padding: '64px 0' }}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 30px',
        }}
      >
        <Typography textAlign='center' mt={5} mb={5} fontSize={30}>
          Мои обсуждения
        </Typography>
        {myDiscussions ? (
          <MyDiscussionsList discussions={myDiscussions} />
        ) : (
          <MyDiscussionsSkeleton />
        )}
      </Container>
    </Box>
  );
};

export default MyDiscussionsPage;
