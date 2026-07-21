import { indexApi } from './indexApi';

export const productService = {
    // All Products get kora
    getAllProducts: async (params = {}) => {
        return await indexApi.get('/products', params);
    },

    // Single Product Detail get kora (ID/Slug diye)
    getProductById: async (id) => {
        return await indexApi.get(`/products/${id}`);
    },

    // Featured Products/Categories (Jodi backend API filter support kare)
    getCategories: async () => {
        return await indexApi.get('/categories');
    }
};