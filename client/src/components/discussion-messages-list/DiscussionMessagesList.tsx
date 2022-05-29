import React, { FC } from 'react';
import { MessageResponse } from '../../models/message.model';
import DiscussionMessage from '../discussion-message/DiscussionMessage';
import { Divider, Box, Typography, Collapse } from '@mui/material';
import EmptyImg from './DiscussionEmpty.svg';
import EmptyImgCreator from './DiscussionEmptyCreator.svg';
import { TransitionGroup } from 'react-transition-group';
import { styled } from '@mui/material/styles';

const StyledTransitionGroup = styled(TransitionGroup)(() => ({
  alignItems: 'flex-start',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
}));

interface DiscussionMessagesListProps {
  messages: MessageResponse[];
  isCreator: boolean;
}

const DiscussionMessagesList: FC<DiscussionMessagesListProps> = ({ messages, isCreator }) => {
  if (messages.length) {
    return (
      <StyledTransitionGroup>
        {messages.map((message, i) => (
          <Collapse key={message.messageId} sx={{ width: '100%' }}>
            <DiscussionMessage message={message} />
            {i < messages.length - 1 && <Divider />}
          </Collapse>
        ))}
      </StyledTransitionGroup>
    );
  }

  // discussion is empty
  return (
    <Box
      padding='15px'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      boxSizing='border-box'
      textAlign='center'
    >
      {!isCreator ? (
        <>
          <Typography fontSize={30}>Будьте первыми!</Typography>
          <Typography>Помогите другому человеку с ответом на его вопрос.</Typography>
          <Box
            component='img'
            src={EmptyImg}
            sx={{ width: { xs: 200, sm: 400 }, pointerEvents: 'none', userSelect: 'none' }}
          />
        </>
      ) : (
        <>
          <Typography fontSize={30}>Пусто!</Typography>
          <Typography>На ваш вопрос пока никто не ответил.</Typography>
          <Box
            component='img'
            src={EmptyImgCreator}
            sx={{ width: { xs: 200, sm: 400 }, pointerEvents: 'none', userSelect: 'none' }}
          />
        </>
      )}
    </Box>
  );
};

export default DiscussionMessagesList;
