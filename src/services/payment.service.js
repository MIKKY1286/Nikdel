import api from './api';

const paymentService = {
  // Initialize payment via backend
  initializePayment: async (email, amount) => {
    // Assuming backend endpoint /payments/initialize
    const response = await api.post('/payments/initialize', { email, amount });
    return response.data;
  },

  // Verify payment via backend (might be handled by /orders, but exposing just in case)
  verifyPayment: async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
};

export default paymentService;
