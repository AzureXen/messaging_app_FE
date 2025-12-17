import api from './api';

export const fetchConversations = async () => {
    const response = await api.get(`/conversations`);
    return response.data;
};

