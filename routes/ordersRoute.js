import express from 'express';
import * as orderController from '../controllers/ordersController.js';
import * as auth from '../controllers/auth.js';
import Order from '../models/orders.js';

const router = express.Router();

router
  .route('/')
  .get(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    orderController.getAllOrders
  )
  .post(
    auth.protectNormalUser,
    auth.addingUserIdToReqBody,
    orderController.createOrder
  );

router
  .route('/myOrders')
  .get(auth.protectNormalUser, orderController.getOrdersForUser);

router
  .route('/:id')
  .get(
    auth.protectNormalUser,
    auth.protectCreatorUser(Order),
    orderController.getOrderById
  );

router.route('/:id/pay').post(
  auth.protectNormalUser,
  //? any one can pay for the order ?????
  // auth.protectCreatorUser(Order),
  orderController.payOrder
);
router
  .route('/:id/deliver')
  .get(
    auth.protectNormalUser,
    auth.restrictTo('admin'),
    orderController.deliverOrder
  );

export default router;
