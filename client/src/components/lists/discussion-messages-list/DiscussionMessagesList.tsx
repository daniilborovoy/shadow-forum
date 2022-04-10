import React, { FC, useEffect, useState } from 'react';
import { MessageResponse } from '../../../models/message.model';
import { Socket } from 'socket.io-client';
import DiscussionMessage from '../../discussion-message/DiscussionMessage';
import { Divider, CircularProgress, Stack, Box, Typography } from '@mui/material';
import EmptyImg from './DiscussionEmpty.svg';

const Messages: FC<{ socket: Socket, discussionId: string }> = ({ socket, discussionId }) => {
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

    const getOldMessagesListener = (messages: MessageResponse[]) => {
      setMessages((prevState) => messages);
    };

    const deleteMessageListener = (messageID: string) => {
      // setMessages((prevMessages) => {
      //   const newMessages = { ...prevMessages };
      //   delete newMessages[messageID];
      //   return newMessages;
      // });
    };

    socket.on('message', messageListener);
    socket.on('old_messages', getOldMessagesListener);
    socket.emit('get_messages', discussionId);
    socket.on('delete_message', deleteMessageListener);

    return () => {
      socket.off('message', messageListener);
      socket.off('delete_message', deleteMessageListener);
      socket.off('old_messages', messageListener);
    };
  }, [socket]);

  useEffect(() => {
    setLoading(false);
  }, [messages]);

  const discussionMessages = messages && messages.map((message) => <DiscussionMessage key={message.messageId}
                                                                                      message={message} />);
  const EmptyMessage = (
    <Box padding='15px' display='flex' flexDirection='column' justifyContent='center' alignItems='center' width='100%'>
      <Typography fontSize={30}>
        Будьте первыми!
      </Typography>
      <Typography>
        Помогите другому с ответом на вопрос.
      </Typography>
      <Box component='img' src={EmptyImg}
           sx={{ width: { xs: 200, sm: 400 }, pointerEvents: 'none', userSelect: 'none' }} />
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
    return <CircularProgress sx={{ padding: 10 }} />;
  };

  return (
    <Stack alignItems={discussionMessages ? 'flex-start' : 'center'} width='100%' flexDirection='column'
           divider={<Divider orientation='horizontal' flexItem />}>
      {showMessages()}
    </Stack>
  );
};

export default Messages;
