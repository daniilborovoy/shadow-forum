import React, { FC, FormEvent, useState } from 'react';
import { Avatar, Box, FormControl, FormGroup, TextField } from '@mui/material';
import { stringAvatar } from '../../../utils/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Send } from '@mui/icons-material';
import { MessageRequest } from '../../../models/message.model';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../../hooks/redux';
import { getUser } from '../../../store/selectors/authSelectors';

const MessageInputForm: FC<{ discussionId: string; userName: string; socket: Socket }> = ({
  discussionId,
  userName,
  socket,
}) => {
  const user = useAppSelector(getUser);

  const [userMessage, setUserMessage] = useState<MessageRequest>({
    message: '',
    discussionId: discussionId,
  });

  const [sendLoading, setSendLoading] = useState<boolean>(false);

  const sendMessageHandler = (event: FormEvent): void => {
    event.preventDefault();
    setSendLoading(true);
    const sendingMessage = userMessage.message.trim();
    if (user) {
      socket.emit('msg', sendingMessage, user.id, userMessage.discussionId, () => {
        setSendLoading(false);
      });
      setUserMessage({
        message: '',
        discussionId: discussionId,
      });
      return;
    }
    alert('Sending error!');
  };

  const avatarUrl = `http://localhost:5000/static/${user?.id}.webp`;
  const isNotValidMessage = userMessage.message.trim().length === 0;

  return (
    <Box sx={{ width: '100%' }} component='form' method='POST' onSubmit={sendMessageHandler}>
      <FormControl variant='standard' sx={{ padding: '15px', width: '100%' }}>
        <FormGroup>
          <Avatar src={avatarUrl} {...stringAvatar(userName)} />
          <TextField
            title='Введите сообщение'
            fullWidth
            value={userMessage.message}
            onChange={(e) => {
              setUserMessage((prev) => ({
                ...prev,
                message: e.target.value,
              }));
            }}
            margin='normal'
            label='Сообщение'
            variant='outlined'
            type='text'
          />
          <LoadingButton
            title='Отправить сообщение'
            sx={{ marginTop: '15px' }}
            loading={sendLoading}
            loadingPosition='start'
            disabled={isNotValidMessage}
            startIcon={<Send />}
            variant='contained'
            type='submit'
          >
            {sendLoading ? 'Отправляем' : 'Отправить ответ'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default MessageInputForm;
