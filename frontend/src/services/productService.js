import { indexApi } from './indexApi';

export const productService = {
    // Get all products
    getProducts: async () => {
        const response = await indexApi.get('/products');
        // Response array kina check ebong safe return
        return response.data?.data || response.data || [];
    },

    // Get single product details
    getProductById: async (id) => {
        const response = await indexApi.get(`/products/${id}`);
        return response.data?.data || response.data;
    },
};