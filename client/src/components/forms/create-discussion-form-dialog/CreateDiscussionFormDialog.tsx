import React, { FormEvent, SyntheticEvent, useState } from 'react';
import { discussionsApi } from '../../../services/discussions.service';
import { DiscussionRequest } from '../../../models/discussion.model';
import {
  Alert,
  Snackbar,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  TextField,
  Button,
  MenuItem,
  ButtonProps, Box, Typography, IconButton,
} from '@mui/material';
import { FC } from 'react';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';

interface DiscussionCreateAlertType {
  show: boolean,
  severity: 'error' | 'success',
  message: string
}

type CreateDiscussionFormDialogType = 'mobile' | 'desktop'

export const CreateDiscussionFormDialog: FC<{ type: CreateDiscussionFormDialogType }> = ({ type }) => {
  const [open, setOpen] = useState<boolean>(false);

  const [createDiscussionAction, {
    isLoading: createDiscussionLoading,
    error: createDiscussionError,
  }] = discussionsApi.useCreateDiscussionMutation();

  const [discussionRequest, setDiscussionRequest] = useState<DiscussionRequest>({
    title: '',
    body: '',
  });

  const [discussionCreateAlert, setDiscussionCreateAlert] = useState<DiscussionCreateAlertType>({
    severity: 'success',
    show: false,
    message: '',
  });

  const createDiscussion = (e: FormEvent): void => {
    e.preventDefault();
    if (!discussionRequest.body || !discussionRequest.title) {
      alert('поля не заполнены!');
      return;
    }
    createDiscussionAction(discussionRequest)
      .unwrap()
      .then(() => {
        handleClose();
        setDiscussionCreateAlert({
          severity: 'success',
          show: true,
          message: `Обсуждение ${discussionRequest.title} создано успешно!`,
        });
      })
      .catch(() => {
        handleClose();
        setDiscussionCreateAlert({
          severity: 'error',
          show: true,
          message: `Произошла ошибка при создании обсуждения! ${createDiscussionError}`,
        });
      });
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setDiscussionRequest(prevState => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setDiscussionRequest(prevState => ({
      ...prevState,
      body: event.target.value,
    }));
  };

  const handleClickOpen = (): void => {
    setOpen(true);
    setDiscussionRequest({
      title: '',
      body: '',
    });
  };

  const handleClose = (): void => {
    setOpen(() => {
      return false;
    });
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#fff',
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: blue[700],
    },
  }));

  const closeDiscussionCreateAlert = (event?: SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickable') {
      return;
    }
    setDiscussionCreateAlert((prevState) => ({
      ...prevState,
      show: false,
    }));
  };

  const createDiscussionAlertMessage: string = discussionCreateAlert.severity === 'success' ? `Обсуждение ${discussionRequest.title} создано успешно!` : 'Произошла ошибка при создании обсуждения!';

  return (
    <Box>
      {type === 'desktop' ?
        <ColorButton onClick={handleClickOpen}>
          <Typography noWrap>
            Создать обсуждение
          </Typography>
        </ColorButton>
        :
        <MenuItem onClick={handleClickOpen}>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='primary-search-account-menu'
            aria-haspopup='true'
            color='inherit'
          >
            <AddIcon />
          </IconButton>
          <Typography>
            Новое обсуждение
          </Typography>
        </MenuItem>
      }
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{discussionRequest.title.length ? discussionRequest.title : 'Новое обсуждение'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Введите короткое название темы и подробное описание для вашего будущего обсуждения.
          </DialogContentText>
          <TextField
            required={true}
            autoFocus
            margin='dense'
            value={discussionRequest.title}
            onChange={handleThemeChange}
            label='Тема обсуждения'
            type='text'
            fullWidth
            variant='standard'
          />
          <TextField
            required={true}
            autoFocus
            margin='dense'
            label='Описание обсуждения'
            value={discussionRequest.body}
            onChange={handleDescriptionChange}
            type='text'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <LoadingButton
            onClick={createDiscussion}
            loading={createDiscussionLoading}
          >
            Создать
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Snackbar open={discussionCreateAlert.show}
                autoHideDuration={10000}
                onClose={closeDiscussionCreateAlert}>
        <Alert closeText='Закрыть' onClose={closeDiscussionCreateAlert}
               severity={discussionCreateAlert.severity}
               sx={{ width: '100%' }}>
          {createDiscussionAlertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
