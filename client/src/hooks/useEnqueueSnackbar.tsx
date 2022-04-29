import { useSnackbar as useDefaultSnackbar, OptionsObject } from 'notistack';
import { Snackbar } from '../components/snackbar/Snackbar';

export const useEnqueueSnackbar = () => {
  const { enqueueSnackbar } = useDefaultSnackbar();

  const pushSnackbar = (
    message: string,
    // extend the default options object
    options?: OptionsObject & Partial<{ variant: 'success' | 'error' | 'warning' | 'info' }>,
  ) => {
    enqueueSnackbar(message, {
      ...options,
      content: (key) => {
        // destructure the options we need from the extended options
        // object, and provide a default case if we didn't provide any
        const { variant } = options || { variant: undefined };
        return <Snackbar id={key} message={message} variant={variant || 'success'} />;
      },
    });
  };

  return pushSnackbar;
};
