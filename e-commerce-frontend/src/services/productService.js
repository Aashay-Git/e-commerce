import api from './api';

const productService = {
    getAllProducts: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`/products?page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    searchProducts: async (keyword, page = 0, size = 10) => {
        try {
            const response = await api.get(`/products/search?keyword=${keyword}&page=${page}&size=${size}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default productService;
