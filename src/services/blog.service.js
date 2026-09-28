import api from './api';

const blogService = {
  // Public routes
  getPosts: async () => {
    const response = await api.get('/blogs');
    return response.data;
  },

  getPost: async (idOrSlug) => {
    const response = await api.get(`/blogs/${idOrSlug}`);
    return response.data;
  },

  // Admin routes
  getAdminPosts: async () => {
    const response = await api.get('/blogs/admin/all');
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/blogs', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.patch(`/blogs/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },
};

export default blogService;
