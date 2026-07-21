import { indexApi } from './indexApi';

export const orderService = {
    // Submit new order
    createOrder: async (orderData) => {
        const response = await indexApi.post('/orders', orderData);
        return response.data;
    },

    // Get current user's order history
    getUserOrders: async () => {
        const response = await indexApi.get('/orders');
        return response.data?.data || response.data || [];
    },
};