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
    if (user) {
      socket.emit('msg', userMessage.message, user.id, userMessage.discussionId, () => {
        setSendLoading(false);
      });
      setUserMessage({
        message: '',
        discussionId: discussionId,
      });
      return;
    }
    alert('sending error');
  };

  return (
    <Box component='form' method='POST' onSubmit={sendMessageHandler}>
      <FormControl variant='standard' sx={{ padding: '15px' }}>
        <FormGroup>
          <Avatar {...stringAvatar(userName)} />
          <TextField
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
            required={true}
          />
          <LoadingButton
            sx={{ marginTop: '15px' }}
            loading={sendLoading}
            loadingPosition='start'
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
