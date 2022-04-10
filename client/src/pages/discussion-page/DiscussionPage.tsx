import { FC, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import {
  Box, Container,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';
import { PageStyleContext } from '../../components/app/App';
import setPageTitle from '../../utils/SetPageTitle';
import MessageInputForm from '../../components/forms/message-input-form/MessageInputForm';
import MessagesList from '../../components/lists/discussion-messages-list/DiscussionMessagesList';
import { Socket } from 'socket.io-client';
import NotFound from '../not-found/NotFound';

const DiscussionPage: FC<{ socket: Socket }> = ({ socket }) => {
  const params = useParams();
  const discussionId = params.id || null;
  const pageStyle = useContext(PageStyleContext);
  const userName = useAppSelector(getUserName);

  const {
    data: discussion,
    isLoading: discussionLoading,
    error: discussionLoadingError,
  } = discussionsApi.useFetchDiscussionByIdQuery(discussionId);

  const [addView] = discussionsApi.useAddViewMutation();

  const addViewHandler = (timeOffset: number): void => {
    setTimeout((): void => {
      if (discussion) {
        if (discussionId && !discussion.isCreator) {
          addView(discussionId);
        }
      }
    }, timeOffset);
  };

  useEffect(() => {
    addViewHandler(8000);
  }, [discussion]);

  useEffect(() => {
    return () => {
      socket.emit('leave_discussion', discussionId);
    };
  }, []);

  if (discussionLoadingError) {
    // @ts-ignore
    return <NotFound message={discussionLoadingError.data.message} />;
  }

  if (!discussionLoading && discussion) {
    setPageTitle(discussion.title);

    return (
      <Box sx={pageStyle}>
        <Container>
          <Typography variant='h3' component='div'>
            <Typography variant='h6' component='div'>Тема обсуждения:</Typography>
            {discussion && discussion.title}
          </Typography>
          <Typography variant='h5' p={2}>
            <Typography variant='h6' component='div'>Описание:</Typography>
            {discussion && discussion.body}
          </Typography>
          <Typography p={2} variant='h5'>Ответы:</Typography>
          <Paper elevation={5} sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
              {discussionId && <MessagesList discussionId={discussionId} socket={socket} />}
              {(discussionId && userName) &&
                <MessageInputForm discussionId={discussionId} userName={userName} socket={socket} />}
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
