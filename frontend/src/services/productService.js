import { indexApi } from './indexApi';

export const productService = {
    // Get all products — supports optional { search, category } filters
    getProducts: async (params = {}) => {
        const queryParams = {};
        if (params.search)   queryParams.search   = params.search;
        if (params.category) queryParams.category = params.category;

        const response = await indexApi.get('/products', { params: queryParams });
        return response.data?.data || response.data || [];
    },

    // Get single product details
    getProductById: async (id) => {
        const response = await indexApi.get(`/products/${id}`);
        return response.data?.data || response.data;
    },
};