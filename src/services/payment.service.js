import api from './api';

const paymentService = {
  initializePayment: async (orderId, amountInKobo) => {
    const response = await api.post(`/payments/initialize/${orderId}`, { amountInKobo });
    return response.data;
  },

  // Verify payment via backend (might be handled by /orders, but exposing just in case)
  verifyPayment: async (reference) => {
    const response = await api.get(`/payments/verify/${reference}`);
    return response.data;
  }
};

export default paymentService;
