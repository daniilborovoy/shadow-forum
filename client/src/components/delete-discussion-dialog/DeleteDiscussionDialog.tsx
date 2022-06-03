import React, { FC, FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { LoadingButton } from '@mui/lab';
import { discussionsApi } from '../../services/discussions.service';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { Delete } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteDiscussionDialog: FC<{ discussionId: string; title: string; refetch: Function }> = ({
  discussionId,
  title,
  refetch,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [deleteDiscussion, { isLoading }] = discussionsApi.useDeleteDiscussionMutation();
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteDiscussionHandler = (event: FormEvent) => {
    event.preventDefault();
    deleteDiscussion(discussionId)
      .unwrap()
      .then((res) => {
        refetch();
        handleClose();
        enqueueSnackbar(`Обсуждение ${title} удалено!`, {
          variant: 'success',
        });
      })
      .catch((err) => {
        handleClose();
        enqueueSnackbar('Произошла ошибка при удалении обсуждения!', {
          variant: 'error',
        });
        console.error(err);
      });
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} title='Удалить обсуждение'>
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} scroll='body' onClose={handleClose}>
        <DialogTitle sx={{ wordWrap: 'break-word', fontWeight: 700 }}>
          Вы точно хотите удалить это обсуждение?
        </DialogTitle>
        <Box component='form'>
          <DialogContent>
            <DialogContentText>После удаления вы не сможете его восстановить.</DialogContentText>
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
              sx={{ fontWeight: 700 }}
              variant='contained'
              color='error'
              type='submit'
              onClick={deleteDiscussionHandler}
              loading={isLoading}
              startIcon={<Delete fontSize='small' />}
            >
              Удалить
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DeleteDiscussionDialog;
