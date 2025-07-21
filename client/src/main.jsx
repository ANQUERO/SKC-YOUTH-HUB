import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostProvider } from '@context/PostContext';
import { AuthContextProvider } from '@context/AuthContext';
import App from './App';
import './index.css';

const client = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostProvider>
      <AuthContextProvider>
        <QueryClientProvider client={client}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </AuthContextProvider>
    </PostProvider>
  </StrictMode>
);
