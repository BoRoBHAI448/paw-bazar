import indexApi from './api';

export const adminService = {
    // 1. Get All Products
    getProducts: async () => {
        const response = await indexApi.get('/products');
        return response.data;
    },

    // 2. Create New Product
    // ⚠️ '/admin/products' er jaigay '/products' koro (jodi backend route '/api/products' hoy)
    createProduct: async (productData) => {
        const response = await indexApi.post('/products', productData);
        return response.data;
    },

    // 3. Update Product
    updateProduct: async (id, productData) => {
        const response = await indexApi.put(`/products/${id}`, productData);
        return response.data;
    },

    // 4. Delete Product
    deleteProduct: async (id) => {
        const response = await indexApi.delete(`/products/${id}`);
        return response.data;
    },
};