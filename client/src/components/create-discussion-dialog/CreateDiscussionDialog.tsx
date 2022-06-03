import React, { FormEvent, useState } from 'react';
import { discussionsApi } from '../../services/discussions.service';
import { DiscussionRequest } from '../../models/discussion.model';
import CreateIcon from '@mui/icons-material/Create';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  TextField,
  Button,
  MenuItem,
  ButtonProps,
  Box,
  Typography,
  IconButton,


} from '@mui/material';
import { FC } from 'react';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useNavigate } from 'react-router-dom';

type CreateDiscussionFormDialogType = 'mobile' | 'desktop';

export const CreateDiscussionDialog: FC<{
  type: CreateDiscussionFormDialogType;
}> = ({ type }) => {
  const [open, setOpen] = useState<boolean>(false);
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();

  const [
    createDiscussionAction,
    { isLoading: createDiscussionLoading, error: createDiscussionError },
  ] = discussionsApi.useCreateDiscussionMutation();

  const [newDiscussion, setNewDiscussion] = useState<DiscussionRequest>({
    title: '',
    body: '',
  });

  const createDiscussion = (e: FormEvent): void => {
    e.preventDefault();
    if (!newDiscussion.body || !newDiscussion.title) {
      alert('поля не заполнены!');
      return;
    }
    createDiscussionAction(newDiscussion)
      .unwrap()
      .then((res) => {
        handleClose();
        navigate(`/discussions/${res.id}`);
        enqueueSnackbar(`Обсуждение ${newDiscussion.title} создано успешно!`, {
          variant: 'success',
        });
      })
      .catch((err) => {
        handleClose();
        enqueueSnackbar('Произошла ошибка при создании обсуждения!', {
          variant: 'error',
        });
        console.error(err);
      });
  };

  const handleThemeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setNewDiscussion((prevState) => ({
      ...prevState,
      title: event.target.value,
    }));
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void => {
    setNewDiscussion((prevState) => ({
      ...prevState,
      body: event.target.value,
    }));
  };

  const handleClickOpen = (): void => {
    setNewDiscussion({
      title: '',
      body: '',
    });
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#fff',
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: blue[700],
    },
  }));

  const disableCreateButton = !newDiscussion.title.length || !newDiscussion.body.length;
  return (
    <Box>
      {type === 'desktop' ? (
        <ColorButton endIcon={<AddIcon fontSize='small' />} onClick={handleClickOpen}>
          <Typography fontWeight='bold' noWrap>
            Создать обсуждение
          </Typography>
        </ColorButton>
      ) : (
        <MenuItem onClick={handleClickOpen}>
          <IconButton size='large' aria-haspopup='true' color='inherit'>
            <AddIcon />
          </IconButton>
          <Typography>Новое обсуждение</Typography>
        </MenuItem>
      )}
      <Dialog open={open} scroll='body' onClose={handleClose}>
        <DialogTitle sx={{ wordWrap: 'break-word', fontWeight: 700 }}>
          {newDiscussion.title.length ? newDiscussion.title : 'Новое обсуждение'}
        </DialogTitle>
        <Box component='form'>
          <DialogContent>
            <DialogContentText>
              Введите короткое название темы и подробное описание для вашего будущего обсуждения.
            </DialogContentText>
            <TextField
              required
              autoFocus
              margin='dense'
              value={newDiscussion.title}
              onChange={handleThemeChange}
              label='Тема обсуждения'
              type='text'
              fullWidth
              variant='standard'
            />
            <TextField
              required
              margin='dense'
              label='Описание обсуждения'
              value={newDiscussion.body}
              onChange={handleDescriptionChange}
              type='text'
              fullWidth
              variant='standard'
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ fontWeight: 700 }}
              variant='text'
              color='inherit'
              type='reset'
              startIcon={<DoDisturbAltIcon fontSize='small' />}
              onClick={handleClose}
            >
              Отмена
            </Button>
            <LoadingButton
              disabled={disableCreateButton}
              sx={{ fontWeight: 700 }}
              variant='contained'
              color='info'
              type='submit'
              onClick={createDiscussion}
              loading={createDiscussionLoading}
              startIcon={<CreateIcon fontSize='small' />}
            >
              Создать
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};
