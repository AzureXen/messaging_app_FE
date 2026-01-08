import api from './api';

export const findUserByNameAndCode = async (nameAndCode) => {
    const response = await api.get(`/users/search/${nameAndCode}`);
    return response.data;
};

export const fetchAllPendings = async () => {
    const response = await api.get(`/relationship/requests/sent`);
    return response.data;
};

// this needs a request body with a "receiverId" ;
export const sendFriendRequest = async (bodyReceiverId, extraHeaders = {}) => {
    // Ensure exactly { receiverId: number }
    const receiverId = Number(bodyReceiverId?.receiverId ?? bodyReceiverId?.id ?? bodyReceiverId);
    if (!Number.isFinite(receiverId)) {
        throw new Error('sendFriendRequest: receiverId is missing or invalid');
    }
    const payload = { receiverId };
    console.log('sending friend request with payload: ', payload);
    try {
        const response = await api.post(`/relationship/send`, payload, { headers: { ...extraHeaders } });
        return response.data;
    } catch (error) {
        if (error?.response) {
            console.error('sendFriendRequest failed', { status: error.response.status, data: error.response.data });
        }
        throw error;
    }
};