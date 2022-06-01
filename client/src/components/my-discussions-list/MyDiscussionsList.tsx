import React, { FC } from 'react';
import { Box, Fade, Typography } from '@mui/material';
import MyDiscussionCard from '../my-discussion-card/MyDiscussionCard';
import MyDiscussionsEmptyImg from './getstarted.svg';
import { DiscussionResponse } from '../../models/discussion.model';
import { CreateDiscussionDialog } from '../create-discussion-dialog/CreateDiscussionDialog';
import { TransitionGroup } from 'react-transition-group';
import { styled } from '@mui/material/styles';

const StyledTransitionGroup = styled(TransitionGroup)(({ theme }) => ({
  display: 'flex',
  gap: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));
const MyDiscussionsList: FC<{ discussions: DiscussionResponse[]; refetch: Function }> = ({
  discussions,
  refetch,
}) => {
  if (!discussions.length) {
    return (
      <>
        <Typography textAlign='center' fontSize={23}>
          Вы не создали ни одного обсуждения
        </Typography>
        <Typography textAlign='justify' fontSize={18}>
          Ещё не всё потярно, вы можете легко создать новое обсуждение прямо сейчас!
        </Typography>
        <Box
          component='img'
          src={MyDiscussionsEmptyImg}
          alt='404'
          loading='lazy'
          sx={{
            width: { xs: 300, sm: 500 },
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        <CreateDiscussionDialog type='desktop' />
      </>
    );
  }
  return (
    <StyledTransitionGroup>
      {discussions.map((discussion) => (
        <Fade key={discussion.id}>
          <Box>
            <MyDiscussionCard discussion={discussion} refetch={refetch} />
          </Box>
        </Fade>
      ))}
    </StyledTransitionGroup>
  );
};

export default MyDiscussionsList;
