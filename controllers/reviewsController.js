import catchAsync from '../utils/catchAsync.js';
import * as factory from '../utils/handlerFactory.js';
import Review from '../models/reviews.js';
import AppError from '../utils/AppError.js';

const appError = new AppError();

export const addProductToReqBody = (req, res, next) => {
  const productId = req.params.id;
  req.body.product = productId;
  next();
};

export const createReview = catchAsync(async (req, res, next) => {
  const dataToSave = {};
  const data = ['review', 'rating', 'user', 'product'];
  data.forEach((key) => {
    dataToSave[key] = req.body[key];
  });
  const user = String(req.user._id);
  const product = String(req.params.id);

  const reviewExists = (await Review.find({ user, product }))[0];
  if (reviewExists) {
    return next(appError.addError('you can review a product once', 400));
  }

  const newDoc = await Review.create(dataToSave);
  res.status(200).json({
    status: 'success',
    data: newDoc,
  });
});

export const getReviewsForProduct = catchAsync(async (req, res, next) => {
  const product = req.params.id;
  const reviews = await Review.find({ product }).populate({
    path: 'user',
    select: 'name email',
  });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  });
});
