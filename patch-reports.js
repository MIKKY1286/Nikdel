import fs from 'fs';
import path from 'path';

const backendPath = '../NIkdel-backend';
const adminControllerPath = path.join(backendPath, 'src', 'controllers', 'admin.controller.js');
const adminRoutesPath = path.join(backendPath, 'src', 'routes', 'admin.routes.js');

let adminController = fs.readFileSync(adminControllerPath, 'utf8');

if (!adminController.includes('getAdvancedReports')) {
  const reportsCode = `
// @desc    Get advanced reports (historical)
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
export const getAdvancedReports = asyncHandler(async (req, res, next) => {
  const now = new Date();
  
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  // Current month revenue
  const currentRevAggr = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: currentMonthStart } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const currentRevenue = currentRevAggr.length > 0 ? currentRevAggr[0].total : 0;
  
  // Previous month revenue
  const prevRevAggr = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);
  const prevRevenue = prevRevAggr.length > 0 ? prevRevAggr[0].total : 0;
  
  // Orders count
  const currentOrders = await Order.countDocuments({ createdAt: { $gte: currentMonthStart } });
  const prevOrders = await Order.countDocuments({ createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } });
  
  // Users count
  const currentUsers = await User.countDocuments({ createdAt: { $gte: currentMonthStart } });
  const prevUsers = await User.countDocuments({ createdAt: { $gte: previousMonthStart, $lt: currentMonthStart } });
  
  res.status(200).json({
    success: true,
    data: {
      revenue: {
        current: currentRevenue,
        previous: prevRevenue,
        growth: prevRevenue === 0 ? 100 : ((currentRevenue - prevRevenue) / prevRevenue) * 100
      },
      orders: {
        current: currentOrders,
        previous: prevOrders,
        growth: prevOrders === 0 ? 100 : ((currentOrders - prevOrders) / prevOrders) * 100
      },
      customers: {
        current: currentUsers,
        previous: prevUsers,
        growth: prevUsers === 0 ? 100 : ((currentUsers - prevUsers) / prevUsers) * 100
      },
      conversion: {
        current: 3.8, // Mocked for now since tracking anonymous visits requires an external analytics provider
        previous: 3.8,
        growth: 0
      }
    }
  });
});
`;
  
  adminController = adminController + reportsCode;
  fs.writeFileSync(adminControllerPath, adminController);
  console.log('Patched admin.controller.js');
}

let adminRoutes = fs.readFileSync(adminRoutesPath, 'utf8');
if (!adminRoutes.includes('getAdvancedReports')) {
  adminRoutes = adminRoutes.replace(
    "  getAllOrders,\n} from '../controllers/admin.controller.js';",
    "  getAllOrders,\n  getAdvancedReports,\n} from '../controllers/admin.controller.js';"
  );
  adminRoutes = adminRoutes.replace(
    "// Dashboard Stats\nrouter.get('/stats', getDashboardStats);",
    "// Dashboard Stats\nrouter.get('/stats', getDashboardStats);\n\n// Advanced Reports\nrouter.get('/reports', getAdvancedReports);"
  );
  fs.writeFileSync(adminRoutesPath, adminRoutes);
  console.log('Patched admin.routes.js');
}
