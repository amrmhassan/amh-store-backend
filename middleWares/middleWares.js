import { app } from '../app.js';
import cors from 'cors';
import postsRoute from '../routes/postsRoute.js';
import usersRoute from '../routes/usersRoute.js';
import productsRoute from '../routes/productsRoute.js';
import ordersRoute from '../routes/ordersRoute.js';
import reviewsRoutes from '../routes/reviewsRoutes.js';
import express from 'express';
import globalErrorHandling from '../utils/globalErrorHandling.js';
import AppError from '../utils/AppError.js';
import uploadsRoute from '../routes/uploadsRoute.js';
import path from 'path';

const appError = new AppError();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
}
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// app.use(express.static(`../public`));
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use('/api/v1/posts', postsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/products', productsRoute);
app.use('/api/v1/orders', ordersRoute);
app.use('/api/v1/reviews', reviewsRoutes);
app.use('/api/v1/upload', uploadsRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/build/index.html'))
  );
}

app.all('*', (req, res, next) => {
  return next(appError.addError(`Can't find this url ${req.originalUrl}`, 404));
});
app.use(globalErrorHandling);
