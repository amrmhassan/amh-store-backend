import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    image: {
      type: String,
    },
    description: String,
    brand: String,
    category: String,
    price: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productsSchema);

export default Product;
