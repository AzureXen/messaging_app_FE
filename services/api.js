import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8080/messaging-app',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        // Guard against SSR where localStorage is not available
        let token = null;
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            try {
                token = localStorage.getItem('token');
            } catch (_) {
                // Access to localStorage can fail in some environments; ignore
            }
        }
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // No token present; allow public requests
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;