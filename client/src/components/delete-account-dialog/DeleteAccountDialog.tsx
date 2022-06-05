import React, { ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import { LoadingButton } from '@mui/lab';
import { Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getUser } from '../../store/selectors/authSelectors';
import { userApi } from '../../services/user.service';
import { useEnqueueSnackbar } from '../../hooks/useEnqueueSnackbar';
import { useNavigate } from 'react-router-dom';
import { discussionsApi } from '../../services/discussions.service';

const DeleteAccountDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmValue, setConfirmValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAppSelector(getUser);
  const [deleteAccount] = userApi.useDeleteUserAccountMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeConfirmValueHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmValue(e.target.value);
  };

  const deleteUserAccount = () => {
    setLoading(true);
    deleteAccount().unwrap().then((res) => {
      handleClose();
      navigate('/authorize');
      dispatch(discussionsApi.internalActions.resetApiState());
      enqueueSnackbar(res.message, {
        variant: 'warning',
      });
    }).catch((err) => {
      console.error(err);
      enqueueSnackbar('Ошибка удаления аккаунта!', {
        variant: 'error',
      });
    }).finally(() => setLoading(false));
  };

  if (user) {
    return (
      <Box>
        <Button fullWidth onClick={handleOpen} endIcon={<DeleteIcon />} sx={{ fontWeight: 700 }} color='error'
                variant='contained'>
          Удалить аккаунт
        </Button>
        <Dialog open={open} scroll='body' onClose={handleClose}>
          <DialogTitle sx={{ wordWrap: 'break-word', fontWeight: 700 }}>
            Подтверждение удаления аккаунта
          </DialogTitle>
          <Box component='form'>
            <DialogContent>
              <DialogContentText component='div' textAlign='justify'>
                Это действие не может быть отменено. Это приведет к безвозвратному удалению вашего аккаунта и всех ваших
                созданных обсуждений и сообщений.
                <Typography mb={2}>
                  Пожалуйста, введите <Typography
                  fontWeight={900}
                  component='span'>{user.email}
                </Typography> для подтверждения.
                </Typography>
              </DialogContentText>
              <TextField fullWidth variant='outlined' value={confirmValue} onChange={changeConfirmValueHandler} />
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
                onClick={deleteUserAccount}
                loading={loading}
                disabled={confirmValue !== user.email}
                startIcon={<Delete fontSize='small' />}
              >
                Удалить
              </LoadingButton>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    );
  }
  return null;
};

export default DeleteAccountDialog;
