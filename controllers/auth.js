import catchAsync from '../utils/catchAsync.js';
import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import genRandomToken from '../utils/generateRandomToken.js';
import { sendEmail } from './emailController.js';
import bcrypt, { compareSync } from 'bcrypt';
import crypto from 'crypto';
import * as factory from '../utils/handlerFactory.js';

const appError = new AppError();

const createAndSendToken = (user, res, statusCode = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.jwtPrivateKey);
  res.status(statusCode).send({
    status: 'success',
    token,
    user,
  });
};

//? signing users up
export const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, phone, photo } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    phone,
    photo,
  });
  createAndSendToken(user, res, 201);
});
//? logging users in
export const login = catchAsync(async (req, res, next) => {
  // 1] check if email, password are in body
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appError.addError('please provide email and password', 400));
  }
  // 2] get user with that email
  const user = await User.findOne({ email });

  // 3] check if there is user
  if (!user) {
    return next(appError.addError('incorrect email or password', 400));
  }
  // 4] compare the real password and the provided one
  const correctPassword = await user.correctPassword(password, user.password);
  if (!correctPassword) {
    return next(appError.addError('incorrect email or password', 400));
  }
  // 5] give the user the token
  createAndSendToken(user, res);
});

//? sending request to the server for getting new password after forgetting it
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1] getting user email from req.body
  const email = req.body.email;
  if (!email) {
    return next(appError.addError('provide user email!', 400));
  }
  // 2] searching for email in db and getting user with that email
  const user = await User.findOne({ email });

  // 3] checking if user exist
  if (!user) {
    return next(appError.addError('invalid email!', 400));
  }
  // 3-a] checking if there is a non expired token in the user data
  if (user.randomToken && user.randomTokenExpiresAt > Date.now()) {
    return next(
      appError.addError(
        `please wait ${
          Math.round(
            ((-Date.now() + new Date(user.randomTokenExpiresAt).getTime()) /
              60000) *
              100
          ) / 100
        } before asking for another token`,
        400
      )
    );
  }
  // 4] generate random token 32 letters and numbers
  const randomToken = genRandomToken(32);
  const encryptedToken = await bcrypt.hash(randomToken, 8);
  // 4-a] save random token to database after hashing it && change expiry date

  //====================
  const randomTokenExpirationDate = 10 * 60 * 1000;

  user.randomToken = encryptedToken;
  user.randomTokenExpiresAt = Date.now() + randomTokenExpirationDate;
  await user.save({ validateBeforeSave: false });
  //====================

  // 5] send it to the user email
  // receiver: options.receiver,
  // subject: options.subject,
  // message: options.message,
  const options = {
    receiver: email,
    subject: 'Resetting password',
    message: `Use this link to reset your password ${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${randomToken} ,Link is only valid for 10 minutes`,
  };
  sendEmail(options);
  // 6] res to the user
  res.status(200).json({
    status: 'success',
    message: 'check your inbox for resetting password link',
  });
});

//? resetting password after getting link for that
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1] getting token from params and email from request body
  const token = req.params.token;
  const email = req.body.email;
  if (!email) {
    return next(
      appError.addError('please provide user email in request body', 400)
    );
  }
  // 2] getting user using provided email
  const user = await User.findOne({ email });
  if (!user) {
    return next(appError.addError('invalid email', 400));
  }

  // 3] checking for token && expiry date
  if (!user.randomToken || !user.randomTokenExpiresAt > Date.now()) {
    return next(appError.addError('invalid token', 400));
  }
  // 4] checking if token is correct
  const correctToken = await bcrypt.compare(token, user.randomToken);
  if (!correctToken) {
    return next(appError.addError('invalid token', 400));
  }
  //5] getting password and passwordConfirm from req.body
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(
      appError.addError(
        'please provide new password and passwordConfirm in the body',
        400
      )
    );
  }
  // 5-a] check if the password is the same as before
  const correctPassword = await user.correctPassword(password, user.password);
  if (password === passwordConfirm && correctPassword) {
    return next(appError.addError(`password is the same as before`, 400));
  }
  // 6] setting password and password confirm
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true });
  // 7] sending the new token
  createAndSendToken(user, res);
});

//? protect normal user
export const protectNormalUser = catchAsync(async (req, res, next) => {
  // 1] get token from headers
  let token = req.headers.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    return next(appError.addError('invalid token', 400));
  }
  token = token.split(' ')[1];
  // 2] verify the token hasn't changed by user manually
  let validToken;
  try {
    validToken = jwt.verify(token, process.env.jwtPrivateKey);
  } catch (err) {
    return next(appError.addError('malformed token', 400));
  }
  // 2-a] get user id from token
  const id = validToken.id;
  const user = await User.findById(id);
  // 2-b] check if user still exist on database
  if (!user) {
    return next(appError.addError('invalid token', 400));
  }

  // 3] check if password changed after generating token (iat property from token)
  const passwordChanged = user.passwordChangedAfter(
    user.passwordChangedAt,
    validToken.iat
  );
  if (passwordChanged) {
    return next(appError.addError('password changed, login again!', 400));
  }
  req.user = user;
  next();
  // 4] login success ==> let the user in by setting req.user to user got from id in token
});

//? update logged in user password

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1] getting user information from req.user
  const user = await User.findById(req.user._id);
  // 2] getting the user old password , new password and its confirmation
  const { oldPassword, password, passwordConfirm } = req.body;
  if (!oldPassword || !password || !passwordConfirm) {
    return next(appError.addError('Please provide passwords', 400));
  }

  // 3] checking for user old password if it is correct
  const correctPassword = await user.correctPassword(
    oldPassword,
    user.password
  );
  if (!correctPassword) {
    return next(appError.addError('Incorrect old password!', 401));
  }
  // 3-a]check if the password is the same as before
  const theSamePassword = await user.correctPassword(password, user.password);
  if (theSamePassword) {
    return next(appError.addError('the password is the same as before!', 400));
  }
  // 4] update user password and, and password changed at then save the new pass
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true });

  createAndSendToken(user, res);
});

//? restrict some resources for specific users
export const restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return next(appError.addError('access denied', 401));
    }
    next();
  });

//? getting the current user
export const getMe = catchAsync(async (req, res, next) => {
  // 1] getting current user information
  const user = await User.findById(req.user._id);
  // 2] sending the date to the client
  res.status(200).json({
    status: 'success',
    user,
  });
});

//? letting the user update his information
export const updateMe = catchAsync(async (req, res, next) => {
  const data = ['name', 'email'];
  const dataToUpdate = {};
  data.forEach((key) => {
    if (req.body[key]) dataToUpdate[key] = req.body[key];
  });
  const id = req.user._id;

  const doc = await User.findByIdAndUpdate(id, dataToUpdate, { new: true });
  if (!doc) {
    return next(appError.addError('no data found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

//! the creator user id in the resource must be saved in 'user' field
export const protectCreatorUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const resourceId = req.params.id;
    const currentUserId = String(req.user._id);
    const resource = await Model.findById(resourceId);
    if (!resource) {
      return next(appError.addError(`no document with ${resourceId} id`, 404));
    }
    const idOfCreatorUser = String(resource.user);
    // console.log('currentUserId', currentUserId);
    // console.log('idOfCreatorUser', idOfCreatorUser);
    if (currentUserId === idOfCreatorUser || req.user.role === 'admin') {
      return next();
    }
    return next(appError.addError('access denied', 401));
  });

export const addingUserIdToReqBody = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};
