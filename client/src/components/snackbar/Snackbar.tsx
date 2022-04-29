import { Alert } from '@mui/material';
import { SnackbarContent, SnackbarKey, useSnackbar } from 'notistack';
import { forwardRef } from 'react';

export const Snackbar = forwardRef<
  HTMLDivElement,
  { id: SnackbarKey; message: string; variant: 'success' | 'error' | 'info' | 'warning' }
>(({ id, message, variant }, ref) => {
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
