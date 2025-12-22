import api from './api';

export const fetchConversations = async () => {
    const response = await api.get(`/conversations`);
    return response.data;
};

export const createConversation = async (conversationName) => {
    try{
        const response = await api.post(`/conversations/group`, conversationName);
        return response.data;
    }catch(error){
        console.error("error while creating conversation, full error: ",error);
    }
};