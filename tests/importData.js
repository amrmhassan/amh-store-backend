import Product from '../models/products.js';
import User from '../models/users.js';
// const User = require('../models/users');
// const Review = require('../models/review');
import products from './data/products.js';
import users from './data/users.js';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost/eCommerce', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err.message));

if (process.argv.includes('--delete')) {
  console.log('include delete');
  const promises = [Product.deleteMany(), User.deleteMany()];
  Promise.all(promises)
    .then(() => {
      console.log('deleted');
      process.exit();
    })
    .catch((err) => {
      console.log(err.message);
      process.exit();
    });
} else if (process.argv.includes('--import')) {
  console.log('include import');
  let promises = [
    Product.create(products),
    // User.create(users),
    // Review.create(reviews),
  ];

  Promise.all(promises)
    .then(() => {
      console.log('imported');
      process.exit();
    })
    .catch((err) => {
      console.log(err.message);
      process.exit();
    });
}
