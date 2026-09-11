import fs from 'fs';
import path from 'path';

const backendPath = '../NIkdel-backend';

// 1. Create Coupon Model
const couponModelPath = path.join(backendPath, 'src', 'models', 'Coupon.js');
const couponModelCode = `import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    trim: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: [true, 'Please add a discount percentage or amount'],
    min: 0
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add an expiry date']
  },
  maxUses: {
    type: Number,
    default: 100
  },
  uses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);
`;
fs.writeFileSync(couponModelPath, couponModelCode);
console.log('Created Coupon.js');

// 2. Create Coupon Controller
const couponControllerPath = path.join(backendPath, 'src', 'controllers', 'coupon.controller.js');
const couponControllerCode = `import { Coupon } from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// @desc    Get all coupons
// @route   GET /api/v1/admin/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, data: coupons });
});

// @desc    Create coupon
// @route   POST /api/v1/admin/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

// @desc    Update coupon
// @route   PUT /api/v1/admin/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res, next) => {
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new ApiError(404, 'Coupon not found'));
  
  coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: coupon });
});

// @desc    Delete coupon
// @route   DELETE /api/v1/admin/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new ApiError(404, 'Coupon not found'));
  
  await coupon.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
`;
fs.writeFileSync(couponControllerPath, couponControllerCode);
console.log('Created coupon.controller.js');

// 3. Create Coupon Routes
const couponRoutesPath = path.join(backendPath, 'src', 'routes', 'coupon.routes.js');
const couponRoutesCode = `import express from 'express';
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getCoupons)
  .post(createCoupon);

router.route('/:id')
  .put(updateCoupon)
  .delete(deleteCoupon);

export default router;
`;
fs.writeFileSync(couponRoutesPath, couponRoutesCode);
console.log('Created coupon.routes.js');
