import api from './api';

const categoryService = {
  // Fetch all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  // Update an existing category
  updateCategory: async (id, categoryData) => {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },
  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
