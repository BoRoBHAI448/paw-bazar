import api from './api';

export const indexApi = {
    // Helper GET Method
    get: async (url, params = {}) => {
        const response = await api.get(url, { params });
        return response.data;
    },

    // Helper POST Method
    post: async (url, data = {}) => {
        const response = await api.post(url, data);
        return response.data;
    },

    // Helper PUT Method
    put: async (url, data = {}) => {
        const response = await api.put(url, data);
        return response.data;
    },

    // Helper DELETE Method
    delete: async (url) => {
        const response = await api.delete(url);
        return response.data;
    }
};