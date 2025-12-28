import api from './api';

export const fetchMessages = async (conversationId) => {
    const response = await api.get(`/messages/${conversationId}`);
    return response.data;
};

export const createMessage = async (conversationId, content, messageType) => {
    const response = await api.post(`/messages`, {
        conversationId: conversationId,
        content: content,
        messageType: messageType,
    });
    return response.data;
};