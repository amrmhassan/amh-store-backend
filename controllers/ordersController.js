import catchAsync from '../utils/catchAsync.js';
import * as factory from '../utils/handlerFactory.js';
import Order from '../models/orders.js';

export const getAllOrders = factory.getAll(Order);
export const getOrderById = factory.getOne(Order, [
  {
    path: 'orderItems.product',
    select: 'name image price',
  },
  {
    path: 'user',
    select: 'name email',
  },
]);

//? helper function for adding user id to the request body

export const createOrder = factory.createOne(Order, [
  'user',
  'orderItems',
  'shippingAddress',
  'paymentMethod',
  'itemsPrice',
  'taxPrice',
  'shippingPrice',
  'totalPrice',
]);

export const getOrdersForUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId });
  if (!orders) {
    return next(appError.addError(`no orders for you yet!`, 404));
  }
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: orders,
  });
});

export const payOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      appError.addError(`no orders found with id ${req.params.id}`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.result,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updatedOrder = await order.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: updatedOrder,
  });
});

export const deliverOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      appError.addError(`no orders found with id ${req.params.id}`, 404)
    );
  }

  if (!order.isPaid) {
    order.isPaid = true;
    order.paidAt = Date.now();
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save({ validateBeforeSave: true });

  res.status(200).json({
    status: 'success',
    data: updatedOrder,
  });
});
