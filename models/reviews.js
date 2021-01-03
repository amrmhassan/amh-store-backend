import mongoose from 'mongoose';
import Product from './products.js';

const reviewsSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    review: {
      type: String,
      required: true,
      maxlength: 255,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

reviewsSchema.statics.calcAvgProductRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        numReviews: result[0].nRating,
        rating: result[0].avgRating,
      },
      {
        useFindAndModify: false,
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      productId,
      {
        numReviews: 0,
        rating: 4.5,
      },
      {
        useFindAndModify: false,
      }
    );
  }
};

reviewsSchema.post('save', async function (doc, next) {
  this.constructor.calcAvgProductRating(this.product);
  next();
});
//? /////////////////////////////////////////////////////////////////////////////

reviewsSchema.post(/^findOneAnd/, async function (doc, next) {
  await doc.constructor.calcAvgProductRating(doc.product);
  next();
});
//? /////////////////////////////////////////////////////////////////////////////
const Review = mongoose.model('review', reviewsSchema);
export default Review;
