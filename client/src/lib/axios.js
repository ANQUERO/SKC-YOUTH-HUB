import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(import.meta.env),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Remove duplicate /api
    if (config.url?.startsWith("/api/")) {
      config.url = config.url.replace("/api/", "/");
    }

    // Try to get auth token from storage
    let authUser = null;
    try {
      const sessionUser = sessionStorage.getItem("auth-user");
      const localUser = localStorage.getItem("auth-user");
      authUser = sessionUser
        ? JSON.parse(sessionUser)
        : localUser
          ? JSON.parse(localUser)
          : null;
    } catch (error) {
      console.error("Error reading auth state:", error);
    }

    // Add auth token to headers if available
    if (authUser?.token) {
      config.headers.Authorization = `Bearer ${authUser.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginAttempt = error.config?.url?.includes("auth/login");
    if (isLoginAttempt && [400, 401, 403].includes(error.response?.status)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.warn("Authentication error:", {
        message: error.response.data.message,
        endpoint: error.config.url,
      });

      localStorage.removeItem("auth-user");
      localStorage.removeItem("active-role");
      sessionStorage.removeItem("auth-user");
      sessionStorage.removeItem("active-role");
      window.dispatchEvent(new Event("auth:unauthorized"));

      return Promise.reject(error);
    }

    console.error("Axios Error Details", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      url: error.config?.url,
    });
    return Promise.reject(error);
  },
);

export default axiosInstance;
