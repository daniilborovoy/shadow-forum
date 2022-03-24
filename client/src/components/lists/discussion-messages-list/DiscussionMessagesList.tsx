import React, { FC, useEffect, useState } from 'react';
import { MessageResponse } from '../../../models/message.model';
import { Socket } from 'socket.io-client';
import DiscussionMessage from '../../discussion-message/DiscussionMessage';
import { Divider, LinearProgress, Stack } from '@mui/material';
const Messages: FC<{ socket: Socket, discussionId: string }> = ({
  socket,
  discussionId,
}) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const messageListener = (message: MessageResponse[]) => {
      setMessages((prevState) => [...prevState, ...message]);
    };

    const deleteMessageListener = (messageID: string) => {
      // setMessages((prevMessages) => {
      //   const newMessages = { ...prevMessages };
      //   delete newMessages[messageID];
      //   return newMessages;
      // });
    };

    socket.on('message', messageListener);
    socket.on('old_messages', messageListener);
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

  return (
    <Stack flexDirection='column' sx={{ padding: '15px' }} divider={<Divider orientation="horizontal" flexItem />}>
      {loading && <LinearProgress />}
      {messages.map((message) => <DiscussionMessage key={message.messageId} message={message} />)}
    </Stack>
  );
};

export default Messages;
