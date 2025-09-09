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
    <AuthContextProvider>
      <QueryClientProvider client={client}>
        <PostProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PostProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>
);
