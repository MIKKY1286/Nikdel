import api from './api';

const productService = {
  // Fetch all products with optional filters
  getAllProducts: async (params = {}) => {
    // Example params: { search: 'tool', category: 'power-tools', maxPrice: 500, sort: 'price-low', limit: 10, page: 1 }
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Fetch a single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create a new product (Admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update a product (Admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product (Admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;
