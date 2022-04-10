import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { discussionsApi } from '../../../services/discussions.service';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  ListItemButton,
  Box,
  Paper, LinearProgress,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const DiscussionsList: FC = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(5);

  const changeLimitHandler = () => {
    setLimit(prevState => prevState + 5);
  };

  const {
    data: discussions,
    isLoading: discussionsLoading,
    error: discussionsLoadingError,
  } = discussionsApi.useFetchAllDiscussionsQuery(limit, {
    pollingInterval: 10000,
    refetchOnMountOrArgChange: true,
  });

  const discussionListItems = discussions && discussions.map((discussion) => {
    const publicationDate = new Date(discussion.creationDate).toLocaleDateString();
    const discussionDescription: string = discussion.body.slice(0, 20) + (discussion.body.length > 20 ? '...' : '');
    const goToDiscussionHandler = (): void => {
      navigate(`/discussions/${discussion.id}`);
    };

    return (
      <ListItemButton
        key={discussion.id}
        sx={{
          width: '100%',
          alignItems: { xs: 'flex-start', sm: 'space-between' },
          justifyContent: { xs: 'flex-start', sm: 'space-between' },
          textAlign: 'start',
          overflow: 'hidden',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
        onClick={goToDiscussionHandler}
      >
        <Box display='flex' flexDirection='row' alignItems='center'>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary={discussion.title}
            secondary={
              <Typography
                sx={{ display: 'inline' }}
                component='span'
                variant='body2'
                color='text.secondary'
              >
                {discussionDescription}
              </Typography>
            }
          />
        </Box>
        <Box display='flex' alignItems='flex-start' flexDirection='row' flexWrap='wrap'>
          <Typography display='flex' justifyContent='center' alignItems='center' color='text.secondary'>
            <ChatBubbleIcon sx={{ margin: '0 10px 0 0' }} />
            {discussion.messagesCount}
          </Typography>
          <Typography display='flex' justifyContent='center' alignItems='center' color='text.secondary'>
            <AccessTimeFilledIcon sx={{ margin: '0 10px 0 10px' }} />
            {publicationDate}
          </Typography>
          <Typography display='flex' justifyContent='center' alignItems='center' color='text.secondary'>
            <RemoveRedEyeIcon sx={{ margin: '0 10px 0 10px' }} />
            {discussion.viewsCount}
          </Typography>
        </Box>
      </ListItemButton>
    );
  });

  if (discussionsLoadingError) {
    return (
      <>
        <Typography textAlign='center' fontSize={20}>Ошибка при загрузке!</Typography>
        <Typography sx={{ wordBreak: 'break-word' }}>Описание
          ошибки: {JSON.stringify(discussionsLoadingError)}</Typography>
      </>
    );
  }

  return (
    <Paper elevation={10} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <List sx={{
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      >
        {discussionsLoading && <LinearProgress />}
        {discussionListItems}
      </List>
      <LoadingButton
        sx={{ marginBottom: '15px' }}
        loading={discussionsLoading}
        loadingPosition='center'
        variant='contained'
        onClick={changeLimitHandler}>
        <AddIcon />
      </LoadingButton>
    </Paper>
  );
};

export default DiscussionsList;
