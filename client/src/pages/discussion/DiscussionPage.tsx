import React, { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import { Box, Button, Container, Divider, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';
import MessageInput from '../../components/message-input/MessageInput';
import MessagesList from '../../components/discussion-messages-list/DiscussionMessagesList';
import dayjs from 'dayjs';
import { MessageResponse } from '../../models/message.model';
import { WebSocket } from '../../providers';
import { Socket } from 'socket.io-client';
import ScrollTopButton from '../../components/scroll-to-top-button/ScrollToTopButton';
import Astronaut from './Astronaut.svg';
import ReplayIcon from '@mui/icons-material/Replay';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import setPageTitle from '../../utils/SetPageTitle';

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
  const enqueueSnackbar = useEnqueueSnackbar();

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

  const reloadPageHandler = () => {
    window.location.reload();
  };

  if (discussionLoadingError || !socket) {
    enqueueSnackbar('Ошибка сети!', {
      variant: 'error',
    });
    return (
      <Box width='100%' height='100vh' display='flex' flexDirection='column' justifyContent='center'
           alignItems='center'>
        <Box
          component='img'
          src={Astronaut}
          alt='Connection Error'
          sx={{ width: 300, pointerEvents: 'none', userSelect: 'none' }}
        />
        <Typography mb={2} fontSize='1.5rem'>Ошибка соединения!</Typography>
        <Button sx={{ fontWeight: 700 }} variant='contained' endIcon={<ReplayIcon />} onClick={reloadPageHandler}>Перезагрузить
          страницу</Button>
      </Box>
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
              {clientsSize > 0 && (
                <Typography color='text.secondary' component='p'>
                  Сейчас просматривают: {clientsSize}
                </Typography>
              )}
            </Box>
          </Box>
          <Box component='section'>
            <Paper
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
                  <MessageInput discussionId={discussionId} userName={userName} />
                )}
              </Box>
            </Paper>
          </Box>
        </Container>
        <ScrollTopButton />
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
