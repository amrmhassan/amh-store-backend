import * as factory from '../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import mongoose from 'mongoose';
import Product from '../models/products.js';

export const getAllProducts = factory.getAll(Product);
export const getOneProduct = factory.getOne(Product);
export const createProduct = factory.createOne(Product, [
  'user',
  'name',
  'image',
  'description',
  'category',
  'brand',
  'price',
  'countInStock',
  'numReviews',
]);
export const updateProduct = factory.updateOne(Product, [
  'name',
  'image',
  'description',
  'brand',
  'price',
  'countInStock',
  'numReviews',
]);

export const deleteProduct = factory.deleteOne(Product);

export const getTopProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort('-rating').limit(3);
  res.status(200).json({
    status: 'success',
    data: products,
  });
});
