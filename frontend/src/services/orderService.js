import indexApi from './api';

export const orderService = {
    // Submit a new order (requires auth)
    createOrder: async (orderData) => {
        const response = await indexApi.post('/orders', orderData);
        return response.data;
    },

    // Get the logged-in user's own order history
    getUserOrders: async () => {
        const response = await indexApi.get('/orders');
        // Backend returns { success: true, orders: [...] }
        return response.data;
    },
};