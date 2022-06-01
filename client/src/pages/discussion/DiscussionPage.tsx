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
import dayjs from 'dayjs';
import AppLoader from '../../components/app-loader/AppLoader';
import { MessageResponse } from '../../models/message.model';
const NotFoundPage = lazy(() => import('../not-found/NotFoundPage'));
import { WebSocket } from '../../providers';
import { Socket } from 'socket.io-client';

interface ChatConnectionResponse {
  status: 'OK' | 'NOK';
  clientsCount?: number;
  error?: string;
}

interface GetDiscussionMessagesResponse {
  status: 'OK' | 'NOK';
  messages?: MessageResponse[];
  error?: string;
}

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

const DiscussionPage: FC = () => {
  const params = useParams();
  const discussionId = params.id || null;
  const userName = useAppSelector(getUserName);
  const [clientsSize, setClientsSize] = useState<number>(0);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const socket = useContext(WebSocket);

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

  const joinDiscussion = (socket: Socket) => {
    try {
      socket.emit('join_discussion', discussionId, (response: ChatConnectionResponse) => {
        if (response.status === 'OK') {
          setClientsSize(response.clientsCount || 0);
        } else {
          throw new Error(response.error);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const messagesListener = (message: MessageResponse) => {
      setMessages((prevState) => [...prevState, message]);
    };

    const userJoinedListener = () => {
      setClientsSize((prevState) => prevState + 1);
    };

    const userLeavedListener = () => {
      setClientsSize((prevState) => prevState - 1);
    };
    // TODO
    // const deleteMessageListener = (messageID: string) => {
    //
    //   setMessages((prevMessages) => {
    //     const newMessages = { ...prevMessages };
    //     delete newMessages[messageID];
    //     return newMessages;
    //   });
    // };

    if (socket) {
      // discussion chat connection
      joinDiscussion(socket);

      socket.emit(
        'get_discussion_messages',
        discussionId,
        (response: GetDiscussionMessagesResponse) => {
          if (response.status === 'OK') {
            setMessages(response.messages || []);
            setLoading(false);
          } else {
            console.error(response.error);
            setLoading(false);
          }
        },
      );

      socket.on('message', messagesListener);
      socket.on('user_joined', userJoinedListener);
      socket.on('user_leaved', userLeavedListener);
      // socket.on('get_discussion_messages', getDiscussionMessagesListener);
      // socket.on('delete_message', deleteMessageListener);
    }
    return () => {
      if (socket) {
        socket.off('message', messagesListener);
        // socket.off('delete_message', deleteMessageListener);
        socket.emit('leave_discussion', discussionId);
      }
    };
  }, [socket, discussionId]);

  // useEffect(() => {
  //   addViewHandler(8000);
  // }, [discussion]);

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
              <Typography color='text.secondary' component='span'>
                Описание:
              </Typography>
              <Typography fontSize={20} component='h2'>
                {discussion && discussion.body}
              </Typography>
            </Box>
            <Box component='div'>
              <Typography color='text.secondary' component='p'>
                Дата создания:{' '}
                <time dateTime={discussion.creationDate.toString()}>
                  <Typography color='text.secondary' component='span'>
                    {dayjs(discussion.creationDate).format('DD MMMM YYYY в H:mm')}
                  </Typography>
                </time>
              </Typography>
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
                {socket && discussionId && !loading ? (
                  <MessagesList messages={messages} isCreator={discussion.isCreator} />
                ) : (
                  MessagesSkeleton
                )}
                {socket && discussionId && userName && (
                  <MessageInputForm discussionId={discussionId} userName={userName} />
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
