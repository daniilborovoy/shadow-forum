import { Alert } from '@mui/material';
import { SnackbarContent, SnackbarKey, useSnackbar } from 'notistack';
import { forwardRef } from 'react';

interface SnackbarProps {
  id: SnackbarKey;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
}

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  ({ id, message, variant }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const handleCloseSnackbar = () => closeSnackbar(id);

    return (
      <SnackbarContent ref={ref}>
        <Alert
          severity={variant}
          sx={{ width: '100%' }}
          onClose={handleCloseSnackbar}
          role='button'
          closeText='Закрыть'
        >
          {message}
        </Alert>
      </SnackbarContent>
    );
  });

export default Snackbar;
