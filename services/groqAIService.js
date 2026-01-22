import api from "@/services/api";

export const groqTranslate = async (message) => {
    const payload = {
        text: message,
    }
    const response = await api.post('/groq/ai/translate', payload);
    return response.data;
};
