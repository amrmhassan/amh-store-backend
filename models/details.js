import mongoose from 'mongoose';

// 1] this model is for viewing details about all kinds of resources
// 2] this data will be updated automatically from each corresponding resource
// 3] if new user added => update the users number += 1 from user model
//! try another methods for achieving that purpose i.e aggregation pipeline from each resource
const detailSchema = new mongoose.Schema({
  products: {
    amount: {
      type: Number,
      default: 0,
    },
  },
  users: {
    number: {
      type: Number,
      default: 0,
    },
  },
});

const Detail = mongoose.model('detail', detailSchema);
export default Detail;
