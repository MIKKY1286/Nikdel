import mongoose from 'mongoose';
import { Product } from '../NIkdel-backend/src/models/Product.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../NIkdel-backend/.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const products = await Product.find({ "price": { "$lte": "500" }, isActive: true, status: 'published' });
    console.log('Query with string 500 returned length:', products.length);
    const products2 = await Product.find({ "price": { "$lte": 500 }, isActive: true, status: 'published' });
    console.log('Query with number 500 returned length:', products2.length);
    const all = await Product.find({});
    console.log('Total products:', all.length);
  } catch (err) {
    console.error(err);
  }
  process.exit();
};
run();
