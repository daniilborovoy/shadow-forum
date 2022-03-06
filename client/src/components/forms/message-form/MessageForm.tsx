import React, { FC, FormEvent, useState } from 'react';
import { Avatar, FormControl, FormGroup, TextField } from '@mui/material';
import { stringAvatar } from '../../../utils/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import { Send } from '@mui/icons-material';
import { messagesApi } from '../../../services/message.service';
import { MessageRequest } from '../../../models/message.model';

const MessageForm: FC<{ discussionId: string, userName: string }> = ({
  discussionId,
  userName,
}) => {

  const [userMessage, setUserMessage] = useState<MessageRequest>({
    message: '',
    discussionId: discussionId,
  });

  const [sendMessage, {
    data: myMessage,
    isLoading: sendMessageLoading,
    error: sendMessageLoadingError,
  }] = messagesApi.useSendMessageMutation();

  const sendMessageHandler = (event: FormEvent) => {
    event.preventDefault();
    if (userMessage.message.length && discussionId) {
      sendMessage(userMessage);
    }
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
            loading={sendMessageLoading}
            loadingPosition='start'
            startIcon={<Send />}
            variant='contained'
            type='submit'
          >
            {sendMessageLoading ? 'Сообщение отправляется' : 'Отправить ответ'}
          </LoadingButton>
        </FormGroup>
      </FormControl>
    </form>
  );
};

export default MessageForm;
