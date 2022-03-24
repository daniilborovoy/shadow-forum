import React, { FC } from 'react';
import { Paper, Typography } from '@mui/material';
import { MessageResponse } from '../../models/message.model';

const DiscussionMessage: FC<{ message: MessageResponse }> = ({ message }) => {
  return (
    <Paper elevation={10} sx={{
      padding: '15px',
      margin: '15px 0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <Typography flexWrap='wrap' sx={{
        display: 'flex',
        wordWrap: 'wrap',
      }}>{message.body}</Typography>
      <Typography>{new Date(message.creationDate).toLocaleString()}</Typography>
    </Paper>
  );
};

export default DiscussionMessage;
