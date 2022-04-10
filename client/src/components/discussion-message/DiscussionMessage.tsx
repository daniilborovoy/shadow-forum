import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { MessageResponse } from '../../models/message.model';
import { userApi } from '../../services/user.service';

const DiscussionMessage: FC<{ message: MessageResponse }> = ({ message }) => {
  const creationDate = new Date(message.creationDate).toLocaleString();
  const { data: answererCredentials } = userApi.useFetchUserByIdQuery(message.userId);
  if (answererCredentials) {
    return (
      <Box sx={{
        padding: '15px',
        margin: '15px 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <Typography fontSize={20}>Ответ от {answererCredentials.name}</Typography>
        <Typography sx={{ wordBreak: 'break-word' }}>{message.body}</Typography>
        <Typography>{creationDate}</Typography>
      </Box>
    );
  }
  return null;
};

export default DiscussionMessage;
