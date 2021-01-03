import express from 'express';
import * as reviewsController from '../controllers/reviewsController.js';
import * as auth from '../controllers/auth.js';

const router = express.Router();

//? get reviews for a product and pass the id of the product
router.route('/:id').get(reviewsController.getReviewsForProduct);

//? create review and pass the id of the product
router
  .route('/:id')
  .post(
    auth.protectNormalUser,
    auth.addingUserIdToReqBody,
    reviewsController.addProductToReqBody,
    reviewsController.createReview
  );

export default router;
