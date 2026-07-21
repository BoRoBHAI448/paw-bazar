import indexApi from './api';

export const orderService = {
    // Submit new order
    createOrder: async (orderData) => {
        const response = await indexApi.post('/orders', orderData);
        return response.data;
    },

    // Get Logged-in User's Orders
    getUserOrders: async () => {
        const response = await indexApi.get('/orders'); // ba /my-orders (Laravel route onujayi)
        return response.data;
    },
};