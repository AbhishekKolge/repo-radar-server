import express from 'express';
import {
  getEmailVerificationOtp,
  removeProfileImage,
  updateProfileImage,
  verifyEmail,
} from './controllers';
import { removeProfileImageSchema, verifyEmailSchema } from './validation';
import { authenticateUser, validateRequest } from 'src/infrastructure/middleware';

export const userRouter = express.Router();

userRouter
  .route('/email/verify')
  .get(authenticateUser, getEmailVerificationOtp)
  .post([authenticateUser, validateRequest(verifyEmailSchema)], verifyEmail);
userRouter
  .route('/profile-image')
  .patch(authenticateUser, updateProfileImage)
  .delete([authenticateUser, validateRequest(removeProfileImageSchema)], removeProfileImage);
