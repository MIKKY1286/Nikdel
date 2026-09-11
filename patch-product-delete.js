import fs from 'fs';
import path from 'path';

const backendPath = '../NIkdel-backend';
const controllerPath = path.join(backendPath, 'src', 'controllers', 'product.controller.js');

let content = fs.readFileSync(controllerPath, 'utf8');

// Ensure cloudinary is imported
if (!content.includes('import cloudinary from')) {
  content = content.replace(
    "import slugify from 'slugify';",
    "import slugify from 'slugify';\nimport cloudinary from '../config/cloudinary.js';"
  );
}

const oldDelete = `// @desc    Delete product (Soft delete by default for products)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
  }

  // Soft delete as requested by business requirements
  product.isActive = false;
  product.status = 'archived';
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Product archived successfully',
    data: {},
  });
});`;

const newDelete = `// @desc    Delete product (Hard delete and remove images)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND'));
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const url of product.images) {
      try {
        // Extract public_id from Cloudinary URL
        // Example: https://res.cloudinary.com/.../upload/v172.../ecommerce/products/xyz.jpg
        const parts = url.split('/');
        const filename = parts.pop().split('.')[0];
        const folder2 = parts.pop();
        const folder1 = parts.pop();
        const publicId = \`\${folder1}/\${folder2}/\${filename}\`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', url, err);
      }
    }
  }

  // Hard delete the product
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product and associated images deleted successfully',
    data: {},
  });
});`;

if (content.includes('export const deleteProduct = asyncHandler(async (req, res, next) => {')) {
  // We'll replace it. Need to use a regex or replace the block.
  // Because it's hard to replace the exact block, I'll use regex.
  const regex = /\/\/ @desc    Delete product \([\s\S]*?\}\);/g;
  content = content.replace(regex, newDelete);
  
  fs.writeFileSync(controllerPath, content);
  console.log('Patched product.controller.js');
} else {
  console.log('Could not find deleteProduct block');
}
