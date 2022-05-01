import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { MessageResponse } from '../../../models/message.model';
import { Socket } from 'socket.io-client';
import DiscussionMessage from '../../discussion-message/DiscussionMessage';
import { Divider, Stack, Box, Typography, LinearProgress, Skeleton, Avatar } from '@mui/material';
import EmptyImg from './DiscussionEmpty.svg';
import { stringAvatar } from '../../../utils/Avatar';

const DiscussionMessagesList: FC<{
  socket: Socket;
  discussionId: string;
  setClientsSize: Dispatch<SetStateAction<number>>;
}> = ({ socket, discussionId, setClientsSize }) => {
  const [messages, setMessages] = useState<MessageResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const messageListener = (message: MessageResponse) => {
      setMessages((prevState) => {
        if (prevState) {
          return [...prevState, message];
        }
        return [message];
      });
    };

    const getOldMessagesListener = (messages: MessageResponse[], clientsCount: number) => {
      setMessages((prevState) => messages);
      setClientsSize(clientsCount);
    };

    const deleteMessageListener = (messageID: string) => {
      // setMessages((prevMessages) => {
      //   const newMessages = { ...prevMessages };
      //   delete newMessages[messageID];
      //   return newMessages;
      // });
    };

    socket.on('msg', messageListener);
    socket.on('old_msg', getOldMessagesListener);
    socket.emit('get_msg', discussionId);
    socket.on('delete_msg', deleteMessageListener);

    return () => {
      socket.off('msg', messageListener);
      socket.off('delete_msg', deleteMessageListener);
      socket.off('old_msg', messageListener);
    };
  }, [socket]);

  useEffect(() => {
    setLoading(false);
  }, [messages]);

  const discussionMessages =
    messages &&
    messages.map((message) => <DiscussionMessage key={message.messageId} message={message} />);
  const EmptyMessage = (
    <Box
      padding='15px'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      boxSizing='border-box'
      textAlign='center'
    >
      <Typography fontSize={30}>Будьте первыми!</Typography>
      <Typography>Помогите другому человеку с ответом на его вопрос.</Typography>
      <Box
        component='img'
        src={EmptyImg}
        sx={{ width: { xs: 200, sm: 400 }, pointerEvents: 'none', userSelect: 'none' }}
      />
    </Box>
  );

  const showMessages = () => {
    if (!loading) {
      if (discussionMessages) {
        if (discussionMessages.length) {
          return discussionMessages;
        }
        return EmptyMessage;
      }
    }
  };

  if (loading || !discussionMessages) {
    return (
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
  }

  return (
    <Stack
      alignItems={discussionMessages ? 'flex-start' : 'center'}
      width='100%'
      flexDirection='column'
      overflow='hidden'
      divider={<Divider flexItem />}
    >
      {discussionMessages.length ? discussionMessages : EmptyMessage}
    </Stack>
  );
};

export default DiscussionMessagesList;
