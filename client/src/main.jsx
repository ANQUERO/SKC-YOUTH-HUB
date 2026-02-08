import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostProvider } from "@context/PostContext";
import { NotificationProvider } from "@context/NotificationContext";
import { ToastProvider } from "@context/ToastContext";
import { AuthContextProvider } from "@context/AuthContext";
import App from "./App";
import "./index.css";

const client = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <NotificationProvider>
            <PostProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </PostProvider>
          </NotificationProvider>
        </ToastProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>,
);
