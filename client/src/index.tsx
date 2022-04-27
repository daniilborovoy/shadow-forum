import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './components/app/App';
import { store } from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, ChosenThemeProvider } from './providers';
import { SnackbarKey, SnackbarMessage, SnackbarProvider } from 'notistack';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Snackbar from './components/snackbar/Snackbar';
dayjs.locale('ru');

const app = document.getElementById('app');
if (!app) throw new Error('Application component is missing in DOM.');
const root = createRoot(app);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChosenThemeProvider>
        <ThemeProvider>
          <SnackbarProvider
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            dense
          >
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </ChosenThemeProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want your hooks to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
