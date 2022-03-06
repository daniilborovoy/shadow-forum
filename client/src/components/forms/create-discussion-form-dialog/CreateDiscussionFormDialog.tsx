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
  ButtonProps,
} from '@mui/material';
import { FC } from 'react';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';

interface DiscussionCreateAlertType {
  show: boolean,
  severity: 'error' | 'success',
}

export const CreateDiscussionFormDialog: FC = () => {
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
  });

  const createDiscussion = (e: FormEvent): void => {
    e.preventDefault();
    if (!discussionRequest.body || !discussionRequest.title) {
      alert('поля не заполнены!');
    }
    createDiscussionAction(discussionRequest)
      .unwrap()
      .then(() => {
        handleClose();
        setDiscussionCreateAlert({
          severity: 'success',
          show: true,
        });
      })
      .catch(() => {
        handleClose();
        setDiscussionCreateAlert({
          severity: 'error',
          show: true,
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
    if (reason === 'clickaway') {
      return;
    }
    setDiscussionCreateAlert((prevState) => ({
      ...prevState,
      show: false,
    }));
  };

  const createDiscussionAlertMessage: string = discussionCreateAlert.severity === 'success' ? `Обсуждение ${discussionRequest.title} создано успешно!` : 'Произошла ошибка при создании обсуждения!';

  return (
    <div>
      <ColorButton onClick={handleClickOpen}>
        Создать обсуждение
      </ColorButton>
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
        <Alert onClose={closeDiscussionCreateAlert}
               severity={discussionCreateAlert.severity}
               sx={{ width: '100%' }}>
          {createDiscussionAlertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
