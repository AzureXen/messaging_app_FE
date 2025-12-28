import api from './api';


export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/profile');
    const normalized = response?.data?.data ?? response?.data ?? response;
    return normalized;
};

export const register = async (data) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error("full error: ", error);
        if (error.response) {
            console.log("Server Error Data:", error.response.data);
            const springError = error.response.data;
            throw new Error(springError.message || "Registration failed");
        } else if (error.request) {
            throw new Error("No response from server. what.");
        } else {
            throw new Error("Unexpected error occurred.");
        }
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};