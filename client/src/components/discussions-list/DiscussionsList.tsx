import React, { Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import { Box, Collapse, List, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { DiscussionResponse } from '../../models/discussion.model';
import dayjs from 'dayjs';
import { TransitionGroup } from 'react-transition-group';
import { styled } from '@mui/material/styles';

interface DiscussionsListProps {
  discussions: DiscussionResponse[];
  searchDiscussion: string;
  discussionsFetching: boolean;
  discussionsLoadingError: unknown;
  setLimit: Dispatch<SetStateAction<number>>;
}

const StyledTransitionGroup = styled(TransitionGroup)(({ theme }) => ({
  width: '100%',
}));

const DiscussionsList: FC<DiscussionsListProps> = ({
                                                     discussions,
                                                     searchDiscussion,
                                                     discussionsFetching,
                                                     discussionsLoadingError,
                                                     setLimit,
                                                   }) => {
  const navigate = useNavigate();

  const changeLimitHandler = () => {
    setLimit((prevState) => prevState + 5);
  };

  const discussionListItems =
    discussions &&
    discussions.map((discussion) => {
      const publicationDate = dayjs(discussion.creationDate).format('DD MMMM YYYY');
      const discussionDescription: string =
        discussion.body.slice(0, 20) + (discussion.body.length > 20 ? '...' : '');
      const goToDiscussionHandler = (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        navigate(`/discussions/${discussion.id}`);
      };
      return (
        <Collapse key={discussion.id}>
          <ListItemButton
            component={'a'}
            divider
            href={`/discussions/${discussion.id}`}
            sx={{
              width: '100%',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              textAlign: 'start',
              overflow: 'hidden',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
            onClick={goToDiscussionHandler}
          >
            <Box
              display='flex'
              marginBottom={{ xs: 2, sm: 0 }}
              flexDirection='row'
              width='100%'
              alignItems='center'
            >
              <ListItemText
                sx={{ marginRight: '15px', wordBreak: 'break-word' }}
                primary={discussion.title}
                secondary={
                  <Typography
                    sx={{ overflow: 'hidden' }}
                    component='span'
                    variant='body2'
                    color='text.secondary'
                  >
                    {discussionDescription}
                  </Typography>
                }
              />
              <Typography
                display={{ xs: 'flex', sm: 'none' }}
                justifyContent='center'
                alignItems='center'
                color='text.secondary'
              >
                <ChatBubbleIcon sx={{ margin: '0 10px 0 0' }} />
                {discussion.messagesCount}
              </Typography>
            </Box>
            <Box
              flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
              display='flex'
              width='100%'
              alignItems='center'
              justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
              flexDirection='row'
            >
              <Typography
                display={{ xs: 'none', sm: 'flex' }}
                justifyContent='center'
                alignItems='center'
                color='text.secondary'
              >
                <ChatBubbleIcon sx={{ margin: '0 10px 0 0' }} />
                {discussion.messagesCount}
              </Typography>
              <time dateTime={discussion.creationDate.toString()}>
                <Typography
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  color='text.secondary'
                >
                  <AccessTimeFilledIcon sx={{ margin: { xs: '0 10px 0 0', sm: '0 10px' } }} />
                  {publicationDate}
                </Typography>
              </time>
              <Typography
                display='flex'
                justifyContent='center'
                alignItems='center'
                color='text.secondary'
              >
                <RemoveRedEyeIcon sx={{ margin: '0 10px 0 10px' }} />
                {discussion.viewsCount}
              </Typography>
            </Box>
          </ListItemButton>
        </Collapse>
      );
    });

  if (discussionsLoadingError) {
    return (
      <>
        <Typography textAlign='center' fontSize={20}>
          Ошибка при загрузке!
        </Typography>
        <Typography sx={{ wordBreak: 'break-word' }}>
          Описание ошибки: {JSON.stringify(discussionsLoadingError)}
        </Typography>
      </>
    );
  }

  return (
    <Paper
      sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', overflow: 'hidden' }}
    >
      <List
        component='nav'
        sx={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: 0,
        }}
      >
        <StyledTransitionGroup>{discussionListItems}</StyledTransitionGroup>
      </List>
      <LoadingButton
        sx={{ margin: '15px 0' }}
        loading={discussionsFetching}
        loadingPosition='center'
        variant='contained'
        onClick={changeLimitHandler}
      >
        <AddIcon />
      </LoadingButton>
    </Paper>
  );
};

export default DiscussionsList;
