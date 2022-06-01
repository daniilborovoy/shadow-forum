import React, { ChangeEvent, FC, FormEvent, useContext, useState } from 'react';
import { Avatar, Box, FormControl, FormGroup, TextField } from '@mui/material';
import { stringAvatar } from '../../utils/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Send } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';
import { WebSocket } from '../../providers';

const MessageInputForm: FC<{ discussionId: string; userName: string }> = ({
  discussionId,
  userName,
}) => {
  const user = useAppSelector(getUser);
  const socket = useContext(WebSocket);
  const [userMessage, setUserMessage] = useState<string>('');
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  const sendMessageHandler = (event: FormEvent) => {
    event.preventDefault();
    setSendLoading(true);
    if (user && socket) {
      socket.emit('message', userMessage.trim(), user.id, discussionId, () => {
        setSendLoading(false);
      });
      setUserMessage('');
      return;
    }
    alert('Sending error!');
  };

  const changeMessageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  const isNotValidMessage = userMessage.trim().length === 0;

  return (
    <Box sx={{ width: '100%' }} component='form' method='POST' onSubmit={sendMessageHandler}>
      <FormControl variant='standard' sx={{ padding: '15px', width: '100%' }}>
        <FormGroup>
          <Avatar src={user?.avatar} {...stringAvatar(userName)} alt={userName} />
          <TextField
            title='Введите сообщение'
            fullWidth
            autoFocus
            value={userMessage}
            onChange={changeMessageHandler}
            margin='normal'
            label='Сообщение'
            variant='outlined'
            type='text'
          />
          <LoadingButton
            title='Отправить сообщение'
            sx={{ marginTop: '15px', fontWeight: 700 }}
            loading={sendLoading}
            loadingPosition='start'
            disabled={isNotValidMessage}
            startIcon={<Send />}
            variant='contained'
            type='submit'
          >
            {sendLoading ? 'Отправляем' : 'Отправить'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default MessageInputForm;
