import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import App from './App.tsx'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import { store } from './Store.ts';



createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <App />
  </Provider>
)
