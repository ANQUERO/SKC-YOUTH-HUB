import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default axiosInstance;
