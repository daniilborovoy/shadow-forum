import { Dispatch, FC, SetStateAction } from 'react';
import { Snackbar } from '@mui/material';
import { Alert, AlertTitle } from '@mui/material';
import { IThemeSwitchAlert } from '../../pages/account-page/AccountPage';

export interface ThemeSwitchAlertProps {
  open: boolean;
  severity: 'success' | 'error';
  message: string;
  setChangeThemeAlert: Dispatch<SetStateAction<IThemeSwitchAlert>>;
}

const ThemeSwitchAlert: FC<ThemeSwitchAlertProps> = ({
  open,
  severity,
  message,
  setChangeThemeAlert,
}) => {
  const handleCloseAlert = () => {
    setChangeThemeAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseAlert}>
      <Alert
        severity={severity}
        color={severity}
        role='button'
        closeText='Закрыть'
        sx={{ fontFamily: '"Montserrat", sans-serif' }}
        onClose={handleCloseAlert}
      >
        <AlertTitle sx={{ fontFamily: '"Montserrat", sans-serif' }}>Изменение темы</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ThemeSwitchAlert;
