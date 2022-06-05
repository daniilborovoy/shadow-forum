import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import App from './components/app/App';
import { store } from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { ChosenThemeProvider, ThemeProvider } from './providers';

dayjs.locale('ru');

const app = document.getElementById('app');
if (!app) throw new Error('Application component is missing in DOM.');
const root = createRoot(app);
root.render(
  <Provider store={store}>
    <ChosenThemeProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ChosenThemeProvider>
  </Provider>,
);

// If you want your hooks to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
