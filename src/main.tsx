import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SiteContentProvider } from './lib/site-content-context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
