import { FC, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';
import { Box, Container, LinearProgress, Paper, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import { getUserName } from '../../store/selectors/authSelectors';
import { PageStyleContext } from '../../components/app/App';
import setPageTitle from '../../utils/SetPageTitle';
import MessageInputForm from '../../components/forms/message-input-form/MessageInputForm';
import MessagesList from '../../components/lists/discussion-messages-list/DiscussionMessagesList';
import { Socket } from 'socket.io-client';
import NotFound from '../not-found/NotFound';
import dayjs from 'dayjs';

const DiscussionPage: FC<{ socket: Socket }> = ({ socket }) => {
  const params = useParams();
  const discussionId = params.id || null;
  const pageStyle = useContext(PageStyleContext);
  const userName = useAppSelector(getUserName);
  const [clientsSize, setClientsSize] = useState<number>(0);

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
          <Box
            component='section'
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box component='div'>
              <Typography fontSize={40} component='h1'>
                {discussion && discussion.title}
              </Typography>
              <Typography color='text.secondary' component='h2'>
                Описание:
              </Typography>
              <Typography fontSize={20} component='p'>
                {discussion && discussion.body}
              </Typography>
            </Box>
            <Box component='div'>
              <Typography color='text.secondary' component='p'>
                Дата создания:
              </Typography>
              <time dateTime={discussion.creationDate.toString()}>
                <Typography color='text.secondary' component='p'>
                  {dayjs(discussion.creationDate).format('DD MMMM YYYY в H:mm:ss')}
                </Typography>
              </time>
              <Typography color='text.secondary' component='p'>
                Сейчас просматривают: {clientsSize}
              </Typography>
            </Box>
          </Box>
          <Typography component='h3' marginBottom={2} textAlign='center' fontSize={30}>
            Ответы
          </Typography>
          <Paper
            component='section'
            elevation={1}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}
            >
              {discussionId && (
                <MessagesList
                  setClientsSize={setClientsSize}
                  discussionId={discussionId}
                  socket={socket}
                />
              )}
              {discussionId && userName && (
                <MessageInputForm discussionId={discussionId} userName={userName} socket={socket} />
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }
  return <LinearProgress />;
};

export default DiscussionPage;
