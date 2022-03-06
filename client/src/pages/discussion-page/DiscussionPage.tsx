import { FC, FormEvent, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import {
  Box,
  FormControl,
  FormGroup,
  FormLabel,
  LinearProgress,
  Paper, TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { messagesApi } from '../../services/message.service';
import { MessageRequest } from '../../models/message.model';
import { Send } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useAppSelector } from '../../hooks/redux';
import { getUser, getUserName } from '../../store/selectors/authSelectors';
import { stringAvatar } from '../../utils/Avatar';
import { PageStyleContext } from '../../components/app/App';
import setPageTitle from '../../utils/SetPageTitle';
import MessageForm from '../../components/forms/message-form/MessageForm';

const DiscussionPage: FC = () => {
  const params = useParams();
  const pageStyle = useContext(PageStyleContext);
  const discussionId = params.id || null;
  const userName = useAppSelector(getUserName);
  const {
    data: discussion,
    isLoading: discussionLoading,
    error: discussionLoadingError,
  } = discussionsApi.useFetchDiscussionByIdQuery(discussionId);

  // TODO добавить функционал сообщений
  // const {
  //   data: messages,
  //   isLoading: messagesLoading,
  //   error: messagesLoadingError,
  //   refetch: subscribe,
  // } = messagesApi.useFetchMessagesByDiscussionIdQuery(id);

  // if (!messagesLoading) {
  //   console.log(messages)
  //   subscribe();
  // }
  const [addView] = discussionsApi.useAddViewMutation();

  const addViewHandler = (timeOffset: number): void => {
    setTimeout((): void => {
      if (discussion) {
        if (discussionId && !discussion.isCreator) {
          addView(discussionId);
        }
      }
    }, timeOffset);
  };

  useEffect(() => {
    addViewHandler(8000);
  }, []);

  if (discussionLoadingError) {
    return (
      <Paper sx={pageStyle} elevation={3}>
        <Typography variant='body2'>
          {JSON.stringify(discussionLoadingError)}
        </Typography>
      </Paper>
    );
  }

  if (!discussionLoading && discussion) {
    setPageTitle(discussion.title);

    return (
      <Box sx={pageStyle}>
        <Typography variant='h3' component='div'>
          <Typography variant='h6' component='div'>Тема обсуждения:</Typography>
          {discussion && discussion.title}
        </Typography>
        <Typography variant='h5' p={2}>
          <Typography variant='h6' component='div'>Описание:</Typography>
          {discussion && discussion.body}
        </Typography>
        <Typography p={2} variant='h5'>Ответы:</Typography>
        <Paper elevation={5} sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          {(discussionId && userName) &&
            <MessageForm discussionId={discussionId} userName={userName} />}
        </Paper>
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
