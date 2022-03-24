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
  Button,
  Paper, LinearProgress,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const DiscussionsList: FC = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(5);

  const navigateHandler = (id: string | undefined): void => {
    navigate(`/discussions/${id}`);
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

    return (
      <ListItem
        key={discussion.id}
        alignItems='flex-start'>
        <Button
          variant='text'
          sx={{
            width: '100%',
            alignItems: 'flex-start',
            textAlign: 'start',
            overflow: 'hidden',
          }}
          onClick={() => navigateHandler(discussion.id)}
        >
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
          <Typography
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            component='span'
            variant='body2'
            color='text.secondary'
            fontSize='2vmin'
          >
            <ChatBubbleIcon sx={{ margin: '0 10px' }} />
            {discussion.messagesCount}
            <AccessTimeFilledIcon sx={{ margin: '0 10px 0 10px' }} />
            {publicationDate}
            <RemoveRedEyeIcon sx={{ margin: '0 10px 0 10px' }} />
            {discussion.viewsCount}
          </Typography>
        </Button>
      </ListItem>
    );
  });

  if (discussionsLoadingError) {
    return <h1>Ошибка при загрузке обсуждений!</h1>;
  }

  return (
    <Paper elevation={10}>
      <List sx={{
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
        {discussionsLoading && <LinearProgress />}
        {discussionListItems}
        <LoadingButton
          loading={discussionsLoading}
          loadingPosition='center'
          variant='outlined'
          onClick={() => {
            setLimit(prevState => prevState + 5);
          }}>
          <AddIcon />
        </LoadingButton>
      </List>
    </Paper>
  );
};

export default DiscussionsList;
