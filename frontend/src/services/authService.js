import { indexApi } from './indexApi';

export const authService = {
    // User Registration
    register: async (userData) => {
        return await indexApi.post('/register', userData);
    },

    // User Login
    login: async (credentials) => {
        return await indexApi.post('/login', credentials);
    },

    // User Logout
    logout: async () => {
        return await indexApi.post('/logout');
    },

    // Get Current User Profile
    getProfile: async () => {
        return await indexApi.get('/user');
    }
};