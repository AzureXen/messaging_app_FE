import api from './api';

export const findUserByNameAndCode = async (nameAndCode) => {
    const response = await api.get(`/users/search/${nameAndCode}`);
    return response.data;
};

export const acceptFriendRequest = async (payload) => {
    const response = await api.post(`/relationship/accept`, payload);
    return response.data;
};

export const cancelFriendRequest = async (payload) => {
    const response = await api.post(`/relationship/cancel`, payload);
    return response.data;
};

export const rejectFriendRequest = async (payload) => {
    const response = await api.post(`/relationship/reject`, payload);
    return response.data;
};

export const unfriendUser = async (payload) => {
    const response = await api.post(`/relationship/unfriend`, payload);
    return response.data;
};

export const fetchAllPendings = async () => {
    const response = await api.get(`/relationship/requests/sent`);
    return response.data;
};

export const fetchAllReceivedRequests = async () => {
    const response = await api.get(`/relationship/requests/received`);
    return response.data;
};

export const fetchAllFriends = async () => {
    const response = await api.get(`/relationship/friends`);
    return response.data;
};

export const sendFriendRequest = async (receiverId) => {
    console.log('sending friend request with payload: ', receiverId);
    try {
        const response = await api.post(`/relationship/send`, receiverId);
        return response.data;
    } catch (error) {
        if (error?.response) {
            console.error('sendFriendRequest failed', { status: error.response.status, data: error.response.data });
        }
        throw error;
    }
};