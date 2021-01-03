import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import * as auth from '../controllers/auth.js';
const router = Router();

//0 1] middle wares
//0 2] routes

//* routes for everyone
router.route('/signup').post(auth.signUp);
router.route('/login').post(auth.login);
router.post('/forgotPassword', auth.forgotPassword);
router.post('/resetPassword/:token', auth.resetPassword);
//* end of routes for everyone
//@
//@
//@
//@
//? routes for normal users
router.use(auth.protectNormalUser);

router.post('/updatePassword', auth.updatePassword);
router.get('/me', auth.getMe);
router.put('/updateMe', auth.updateMe);
//? end of normal users routes
//@
//@
//@
//@
//! routes for admins only
router.use(auth.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addNewUser);
router
  .route('/:id')
  .get(userController.getOne)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

//! end of admins routes
export default router;
