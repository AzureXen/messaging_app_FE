import api from './api';

export const fetchConversations = async (type) => {
    if(type !== null){
        const response = await api.get(`/conversations?isGroup=${type}`);
        return response.data;
    }
    else{
        const response = await api.get(`/conversations`);
        return response.data;
    }

};

export const createConversation = async (conversationName) => {
    try{
        const response = await api.post(`/conversations/group`, conversationName);
        return response.data;
    }catch(error){
        console.error("error while creating conversation, full error: ",error);
    }
};

export const fetchConversationMembers = async (conversationId) => {
    try{
        const response = await api.get(`/members/${conversationId}`);
        return response.data;
    }catch(error){
        console.error("error while fetching conversation, full error: ",error);
    }
};

export const fetchIsMember = async (conversationId) => {
    try{
        const response = await api.get(`/members/${conversationId}/me`);
        return response.data;
    }catch(error){
        console.error("error while fetching isMember, full error: ",error);
    }
};