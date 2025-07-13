import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostProvider } from '@context/PostContext';
import { Provider } from 'react-redux'
import { store } from 'reducers/store.js'
import App from './App';
import './index.css';

const client = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PostProvider>
        <QueryClientProvider client={client}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </PostProvider>
    </Provider>
  </StrictMode>
);
