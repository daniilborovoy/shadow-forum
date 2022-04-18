import React, { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react';
import { Alert, ClickAwayListener, Snackbar } from '@mui/material';
import { AuthAlert } from '../../models/auth.model';

const AuthorizationAlert: FC<{
  authAlert: AuthAlert;
  setAuthAlert: Dispatch<SetStateAction<AuthAlert>>;
}> = ({ authAlert, setAuthAlert }) => {
  const closeAuthAlertHandler = (event?: SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setAuthAlert((prev) => ({
      ...prev,
      showMessage: false,
    }));
    return;
  };

  return (
    <Snackbar open={authAlert.showMessage} autoHideDuration={6000} onClose={closeAuthAlertHandler}>
      <Alert
        closeText='Закрыть'
        onClose={closeAuthAlertHandler}
        severity={authAlert.severity}
        sx={{ width: '100%' }}
      >
        {authAlert.message}
      </Alert>
    </Snackbar>
  );
};

export default AuthorizationAlert;
