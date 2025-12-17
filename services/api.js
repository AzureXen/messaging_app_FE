import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8080/messaging-app',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
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