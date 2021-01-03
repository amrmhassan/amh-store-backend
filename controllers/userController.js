import catchAsync from '../utils/catchAsync.js';
import User from '../models/users.js';
import * as factory from '../utils/handlerFactory.js';

export const getAllUsers = factory.getAll(User);
export const addNewUser = factory.createOne(User, [
  'name',
  'email',
  'password',
  'passwordConfirm',
  'photo',
  'phone',
]);

export const updateUser = factory.updateOne(User, ['name', 'email', 'role']);
export const getOne = factory.getOne(User);
export const deleteUser = factory.deleteOne(User);
