import { ReactNode, useContext, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';

import { ChosenTheme } from './chosenTheme';
import { grey } from '@mui/material/colors';

const createThemeHelper = (theme: 'dark' | 'light') => {
  const isDark = theme === 'dark';
  return createTheme({
    palette: {
      mode: theme,
      background: {
        default: isDark ? '#282828' : '#ffffff',
        paper: isDark ? '#262626' : '#ffffff',
      },
      primary: {
        main: grey[900],
      },
      secondary: {
        main: grey[300],
      },
      error: {
        main: 'rgb(232, 51, 51)',
      },
      success: {
        main: 'rgb(76,175,80)',
      },
    },
    typography: {
      fontFamily: 'Montserrat',
    },
    components: {
      MuiTextField: {
        defaultProps: {
          color: isDark ? 'secondary' : 'primary',
        },
      },
    },
  });
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useContext(ChosenTheme);
  const muiTheme = useMemo(() => createThemeHelper(theme), [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
