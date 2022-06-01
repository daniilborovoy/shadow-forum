import React, { FC } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { MessageResponse } from '../../models/message.model';
import dayjs from 'dayjs';
import { stringAvatar } from '../../utils/Avatar';

const DiscussionMessage: FC<{ message: MessageResponse }> = ({ message }) => {
  const creationDate = dayjs(message.creationDate).format('H:mm DD.MM.YYYY');

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
      <Avatar
        src={message.createdBy.avatar}
        {...stringAvatar(message.createdBy.name)}
        alt={message.createdBy.name}
      />
      <Box sx={{ marginLeft: '15px' }}>
        <Box display='flex' flexWrap='wrap' flexDirection='row' alignItems='center'>
          <Typography mr={1} fontSize={20} fontWeight='bold'>
            {message.createdBy.name}
          </Typography>
          <time dateTime={message.creationDate.toString()}>
            <Typography sx={{ '&:hover': { textDecoration: 'underline' } }} color='text.secondary'>
              {creationDate}
            </Typography>
          </time>
        </Box>
        <Typography sx={{ wordBreak: 'break-word' }} fontWeight='medium'>
          {message.body}
        </Typography>
      </Box>
    </Box>
  );
};

export default DiscussionMessage;
