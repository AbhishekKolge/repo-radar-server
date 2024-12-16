import express from 'express';
import {
  deleteUser,
  getEmailVerificationOtp,
  removeProfileImage,
  updateProfileImage,
  verifyEmail,
} from './controllers';
import { removeProfileImageSchema, verifyEmailSchema } from './validation';
import { authenticateUser, isTestUser, validateRequest } from 'src/infrastructure/middleware';

export const userRouter = express.Router();

userRouter
  .route('/email/verify')
  .get(authenticateUser, getEmailVerificationOtp)
  .post([authenticateUser, validateRequest(verifyEmailSchema)], verifyEmail);
userRouter
  .route('/profile-image')
  .patch(authenticateUser, updateProfileImage)
  .delete([authenticateUser, validateRequest(removeProfileImageSchema)], removeProfileImage);
userRouter.route('/').delete([authenticateUser, isTestUser], deleteUser);
