import React, { FC } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { Box, CardActionArea, CardActions } from '@mui/material';
import { DiscussionResponse } from '../../models/discussion.model';
import MessageIcon from '@mui/icons-material/ChatBubble';
import ViewIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import DeleteDiscussionDialog from '../delete-discussion-dialog/DeleteDiscussionDialog';

const MyDiscussionCard: FC<{ discussion: DiscussionResponse; refetch: Function }> = ({
  discussion,
  refetch,
}) => {
  const navigate = useNavigate();
  const goToDiscussionHandler = () => {
    navigate(`/discussions/${discussion.id}`);
  };
  const creationDate = dayjs(discussion.creationDate).format('DD MMMM YYYY в H:mm');
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { sm: 345, xs: 260 },
        minHeight: 200,
      }}
    >
      <CardActionArea
        title='Перейти к обсуждению'
        onClick={goToDiscussionHandler}
        sx={{ display: 'flex', flexGrow: '1' }}
      >
        <CardContent
          sx={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
          }}
        >
          <Box display='flex' flexDirection='row' justifyContent='space-between'>
            <Box padding='0 15px 15px 0'>
              <Typography
                sx={{ wordBreak: 'break-word' }}
                gutterBottom
                variant='h5'
                component='div'
              >
                {discussion.title}
              </Typography>
              <Typography sx={{ wordBreak: 'break-word' }} variant='body2' color='text.secondary'>
                {discussion.body}
              </Typography>
            </Box>
            <Box>
              <Box display='flex' color='text.secondary' alignItems='center'>
                <MessageIcon color='inherit' />
                <Typography ml={1} variant='body2'>
                  {discussion.messagesCount}
                </Typography>
              </Box>
              <Box display='flex' color='text.secondary' alignItems='center'>
                <ViewIcon color='inherit' />
                <Typography ml={1} variant='body2'>
                  {discussion.viewsCount}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography color='text.secondary' mt={5}>
            Создано {creationDate}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <DeleteDiscussionDialog
          refetch={refetch}
          discussionId={discussion.id}
          title={discussion.title}
        />
      </CardActions>
    </Card>
  );
};

export default MyDiscussionCard;
