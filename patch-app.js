import fs from 'fs';
import path from 'path';

const backendPath = '../NIkdel-backend';
const appJsPath = path.join(backendPath, 'src', 'app.js');

let content = fs.readFileSync(appJsPath, 'utf8');

if (!content.includes('couponRoutes')) {
  content = content.replace(
    "import adminRoutes from './routes/admin.routes.js';",
    "import adminRoutes from './routes/admin.routes.js';\nimport couponRoutes from './routes/coupon.routes.js';"
  );
  
  content = content.replace(
    "app.use('/api/v1/admin', adminRoutes);",
    "app.use('/api/v1/admin', adminRoutes);\napp.use('/api/v1/admin/coupons', couponRoutes);"
  );
  
  fs.writeFileSync(appJsPath, content);
  console.log('Patched app.js');
} else {
  console.log('Already patched');
}
