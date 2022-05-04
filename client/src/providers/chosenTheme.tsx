import { createContext, Dispatch, SetStateAction, useState, ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppSelector } from '../hooks/redux';
import { getUserTheme } from '../store/selectors/authSelectors';

type ThemeName = 'dark' | 'light';

interface IChosenTheme {
  theme: ThemeName;
}

export const ChosenTheme = createContext<IChosenTheme>({} as IChosenTheme);

export const ChosenThemeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', { noSsr: true });
  const userTheme = useAppSelector(getUserTheme);
  const theme = userTheme === 'system' ? (prefersDarkMode ? 'dark' : 'light') : userTheme;
  return <ChosenTheme.Provider value={{ theme }}>{children}</ChosenTheme.Provider>;
};
