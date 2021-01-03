import express from 'express';
import * as productsController from '../controllers/productsController.js';
import * as auth from '../controllers/auth.js';

const router = express.Router();

router.route('/getTopProducts').get(productsController.getTopProducts);

router
  .route('/')
  .get(productsController.getAllProducts)
  .post(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    productsController.createProduct
  );

router
  .route('/:id')
  .get(productsController.getOneProduct)
  .patch(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    productsController.updateProduct
  )
  .delete(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    productsController.deleteProduct
  );
export default router;
