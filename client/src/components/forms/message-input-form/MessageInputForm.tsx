import React, { FC, FormEvent, useState } from 'react';
import { Avatar, FormControl, FormGroup, TextField } from '@mui/material';
import { stringAvatar } from '../../../utils/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Send } from '@mui/icons-material';
import { MessageRequest } from '../../../models/message.model';
import { Socket } from 'socket.io-client';
import { useAppSelector } from '../../../hooks/redux';
import { getUser } from '../../../store/selectors/authSelectors';

const MessageInputForm: FC<{ discussionId: string, userName: string, socket: Socket }> = ({
  discussionId,
  userName,
  socket,
}) => {

  const user = useAppSelector(getUser);

  const [userMessage, setUserMessage] = useState<MessageRequest>({
    message: '',
    discussionId: discussionId,
  });

  const sendMessageHandler = (event: FormEvent): void => {
    event.preventDefault();
    if (user) {
      socket.emit('message', userMessage.message, user.id, userMessage.discussionId);
      setUserMessage({
        message: '',
        discussionId: discussionId,
      });
      return;
    }
    alert('sending error');
    return;
  };

  return (
    <form method='POST' onSubmit={sendMessageHandler}>
      <FormControl variant='standard' sx={{ padding: '15px' }}>
        <FormGroup>
          <Avatar {...stringAvatar(userName)} />
          <TextField value={userMessage.message}
                     onChange={(e) => {
                       setUserMessage((prev) => ({
                         ...prev,
                         message: e.target.value,
                       }));
                     }}
                     margin='normal' label='Сообщение' variant='outlined' type='text'
                     required={true} />
          <LoadingButton
            sx={{ marginTop: '15px' }}
            // loading={sendMessageLoading}
            loadingPosition='start'
            startIcon={<Send />}
            variant='contained'
            type='submit'
          >
            Отправить ответ
            {/* {sendMessageLoading ? 'Сообщение отправляется' : 'Отправить ответ'} */}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </form>
  );
};

export default MessageInputForm;
