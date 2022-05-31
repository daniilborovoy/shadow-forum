import { FC, lazy, Suspense, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import {
  Box,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';
import setPageTitle from '../../utils/SetPageTitle';
import MessageInputForm from '../../components/message-input/MessageInputForm';
import MessagesList from '../../components/discussion-messages-list/DiscussionMessagesList';
import { Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import AppLoader from '../../components/app-loader/AppLoader';
import { MessageResponse } from '../../models/message.model';
const NotFoundPage = lazy(() => import('../not-found/NotFoundPage'));

const MessagesSkeleton = (
  <Stack
    width='100%'
    flexDirection='column'
    overflow='hidden'
    divider={<Divider color='#000' flexItem />}
  >
    <Skeleton animation='wave' variant='rectangular' width='100%' height={108} />
    <Skeleton animation='wave' variant='rectangular' width='100%' height={108} />
    <Skeleton animation='wave' variant='rectangular' width='100%' height={108} />
  </Stack>
);

const DiscussionPage: FC<{ socket: Socket }> = ({ socket }) => {
  const params = useParams();
  const discussionId = params.id || null;
  const userName = useAppSelector(getUserName);
  const [clientsSize, setClientsSize] = useState<number>(1);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    data: discussion,
    isLoading: discussionLoading,
    error: discussionLoadingError,
  } = discussionsApi.useFetchDiscussionByIdQuery(discussionId);

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
    const messagesListener = (message: MessageResponse) => {
      setMessages((prevState) => [...prevState, message]);
    };

    const getOldMessagesListener = (messages: MessageResponse[], clientsCount: number) => {
      setMessages(messages);
      setClientsSize(clientsCount);
      setLoading(false);
    };

    const deleteMessageListener = (messageID: string) => {
      // TODO
      // setMessages((prevMessages) => {
      //   const newMessages = { ...prevMessages };
      //   delete newMessages[messageID];
      //   return newMessages;
      // });
    };

    socket.on('msg', messagesListener);
    socket.on('old_msg', getOldMessagesListener);
    socket.on('delete_msg', deleteMessageListener);

    socket.emit('get_msg', discussionId);
    return () => {
      socket.off('msg', messagesListener);
      socket.off('delete_msg', deleteMessageListener);
      socket.off('old_msg', messagesListener);
    };
  }, [socket, discussionId]);

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
      <Suspense fallback={<AppLoader />}>
        {/* @ts-ignore */}
        <NotFoundPage message={discussionLoadingError.data.message} />
      </Suspense>
    );
  }

  if (!discussionLoading && discussion) {
    setPageTitle(discussion.title);

    return (
      <Box component='main' sx={{ width: '100%', minHeight: '100vh', padding: '81px 0' }}>
        <Container>
          <Box
            component='section'
            marginBottom={5}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box component='div'>
              <Typography fontSize={40} component='h1'>
                {discussion && discussion.title}
              </Typography>
              <Typography color='text.secondary' component='h2'>
                Описание:
              </Typography>
              <Typography fontSize={20} component='p'>
                {discussion && discussion.body}
              </Typography>
            </Box>
            <Box component='div'>
              <Typography color='text.secondary' component='p'>
                Дата создания:
              </Typography>
              <time dateTime={discussion.creationDate.toString()}>
                <Typography color='text.secondary' component='p'>
                  {dayjs(discussion.creationDate).format('DD MMMM YYYY в H:mm')}
                </Typography>
              </time>
              <Typography color='text.secondary' component='p'>
                Сейчас просматривают: {clientsSize}
              </Typography>
            </Box>
          </Box>
          <Box component='section'>
            <Paper
              elevation={5}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                {discussionId && !loading ? (
                  <MessagesList messages={messages} isCreator={discussion.isCreator} />
                ) : (
                  MessagesSkeleton
                )}
                {discussionId && userName && (
                  <MessageInputForm
                    discussionId={discussionId}
                    userName={userName}
                    socket={socket}
                  />
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
