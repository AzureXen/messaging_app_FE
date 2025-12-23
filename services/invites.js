import api from './api';

export const fetchInviteInfo = async (inviteCode) => {
    const response = await api.get(`/invite/${inviteCode}`);
    return response.data;
};

export const joinViaInvite = async (inviteCode) => {
    try{
        const response = await api.post(`/invite/${inviteCode}`);
        return response.data;
    }catch(error){
        console.error("error while creating conversation, full error: ",error);
    }
};

export const createInvite = async (createInviteRequest) => {
    try{
        const response = await api.post(`/invite`, createInviteRequest);
        return response.data;
    }catch(error){
        console.error("error while creating conversation, full error: ",error);
    }
};