import api from './api';

const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAdvancedReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  // Fetch all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Fetch all orders
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Coupons
  getAllCoupons: async () => {
    const response = await api.get('/admin/coupons');
    return response.data;
  },
  createCoupon: async (couponData) => {
    const response = await api.post('/admin/coupons', couponData);
    return response.data;
  },
  updateCoupon: async (couponId, couponData) => {
    const response = await api.put(`/admin/coupons/${couponId}`, couponData);
    return response.data;
  },
  deleteCoupon: async (couponId) => {
    const response = await api.delete(`/admin/coupons/${couponId}`);
    return response.data;
  }
};

export default adminService;
