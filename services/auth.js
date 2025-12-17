import api from './api';


export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/profile');
    // Normalize common API shapes: { data: user } or direct user object
    const normalized = response?.data?.data ?? response?.data ?? response;
    console.log("getMe normalized:", normalized);
    return normalized;
};

export const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};