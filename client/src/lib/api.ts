import axios from 'axios';

// Get domain from environment or fallback to localhost
const SERVER_DOMAIN = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: SERVER_DOMAIN,
});

// Add interceptor to automatically add the Auth token
api.interceptors.request.use((config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
        const { state } = JSON.parse(authData);
        if (state.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
        }
    }
    return config;
});

export default api;
