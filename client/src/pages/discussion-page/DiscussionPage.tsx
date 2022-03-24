import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import {
  Box,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';
import { PageStyleContext } from '../../components/app/App';
import setPageTitle from '../../utils/SetPageTitle';
import MessageInputForm from '../../components/forms/message-input-form/MessageInputForm';
import MessagesList from '../../components/lists/discussion-messages-list/DiscussionMessagesList';
import { io, Socket } from 'socket.io-client';

const DiscussionPage: FC<{ socket: Socket }> = ({ socket }) => {
  const params = useParams();
  const discussionId = params.id || null;
  const pageStyle = useContext(PageStyleContext);
  const userName = useAppSelector(getUserName);
  const [messages, setMessages] = useState<string[]>(['mock']);

  // if (discussionId) {
  //   socket.emit('join to discussion', discussionId);
  //
  //   socket.on('discussion message', (message) => {
  //     setMessages(prevState => [...prevState, message]);
  //   });
  // }

  // socket.on('private message', (anotherSocketId, msg) => {
  //   console.log(anotherSocketId + ' ' + msg);
  // });

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
  }, [discussion]);

  useEffect(() => {
    return () => {
      socket.emit('leave_discussion', discussionId);
    };
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
          <Box sx={{ flexDirection: 'column', width: '100%' }}>
            {discussionId && <MessagesList discussionId={discussionId} socket={socket} />}

            {(discussionId && userName) &&
              <MessageInputForm discussionId={discussionId} userName={userName} socket={socket} />}
          </Box>
        </Paper>
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
