import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Remove duplicate /api 
        if (config.url?.startsWith('/api/')) {
            config.url = config.url.replace('/api/', '/');
        }

        // Try to get auth token from storage
        let authUser = null;
        try {
            const sessionUser = sessionStorage.getItem('auth-user');
            const localUser = localStorage.getItem('auth-user');
            authUser = sessionUser ? JSON.parse(sessionUser) : localUser ? JSON.parse(localUser) : null;
        } catch (error) {
            console.error('Error reading auth state:', error);
        }

        // Add auth token to headers if available
        if (authUser?.token) {
            config.headers.Authorization = `Bearer ${authUser.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Authentication error:', {
                message: error.response.data.message,
                endpoint: error.config.url
            });

            localStorage.removeItem('auth-user');
            sessionStorage.removeItem('auth-user');

            return Promise.reject(error);
        }

        const isLoginAttempt = error.config?.url?.includes('auth/signin');
        if (error.response?.status === 400 && isLoginAttempt) {
            return Promise.reject(error)
        }

        console.error('Axios Error Details', {
            config: error.config,
            status: error.response?.status,
            data: error.response?.data,
            message: message.error,
            baseURL: error.config?.baseURL,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);


export default axiosInstance;
