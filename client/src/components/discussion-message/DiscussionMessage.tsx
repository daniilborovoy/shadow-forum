import React, { FC } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { MessageResponse } from '../../models/message.model';
import dayjs from 'dayjs';
import { stringAvatar } from '../../utils/Avatar';

const DiscussionMessage: FC<{ message: MessageResponse }> = ({ message }) => {
  const creationDate = dayjs(message.creationDate).format('DD MMMM YYYY в H:mm');
  const avatarUrl = `http://localhost:5000/static/${message.createdBy._id}.webp`;

  return (
    <Box
      sx={{
        padding: '15px',
        margin: '15px 0',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Avatar src={avatarUrl} {...stringAvatar(message.createdBy.name)} />
      <Box sx={{ marginLeft: '15px' }}>
        <Typography fontSize={20}>Ответ от {message.createdBy.name}</Typography>
        <Typography sx={{ wordBreak: 'break-word' }}>{message.body}</Typography>
        <time dateTime={message.creationDate.toString()}>
          <Typography>{creationDate}</Typography>
        </time>
      </Box>
    </Box>
  );
};

export default DiscussionMessage;
