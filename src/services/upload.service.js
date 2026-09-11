import api from './api';

const uploadService = {
  // Upload image to backend which then uploads to Cloudinary
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('images', file);

    const response = await api.post('/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Assume response returns { url: 'https://cloudinary.com/...' }
    return response.data;
  }
};

export default uploadService;
