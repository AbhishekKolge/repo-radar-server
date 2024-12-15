import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './service';
import {
  RemoveProfileImageRequestQuery,
  UpdateProfileImageResponse,
  VerifyEmailRequestBody,
} from './types';
import { NotificationService } from 'src/domain/services';
import { AuthUser } from 'src/infrastructure/shared/types';

export const getUser = () => {
  const userService = new UserService();

  // await userService.deleteProfileImage(req.user as AuthUser, req.query.imageId);
};

export const getEmailVerificationOtp = async (req: Request, res: Response) => {
  const userService = new UserService();
  const { verificationCode, ...user } = await userService.getEmailVerificationOtp(
    req.user as AuthUser,
  );

  const notificationService = new NotificationService();
  await notificationService.sendVerificationEmail(user, verificationCode);

  res.status(StatusCodes.OK).json({
    message: `Email verification code sent to ${user.email}`,
  });
};

export const verifyEmail = async (
  req: Request<unknown, unknown, VerifyEmailRequestBody>,
  res: Response,
) => {
  const { code } = req.body;
  const userService = new UserService();
  await userService.verifyEmail(req.user as AuthUser, code);
  res.status(StatusCodes.OK).json({ message: 'Email verified successfully' });
};

export const updateProfileImage = async (
  req: Request,
  res: Response<UpdateProfileImageResponse>,
) => {
  const userService = new UserService();
  const imageDetails = await userService.updateProfileImage(req);

  res.status(StatusCodes.OK).json(imageDetails);
};

export const removeProfileImage = async (
  req: Request<unknown, unknown, unknown, RemoveProfileImageRequestQuery>,
  res: Response,
) => {
  const userService = new UserService();
  await userService.deleteProfileImage(req.user as AuthUser, req.query.imageId);

  res.status(StatusCodes.OK).json({
    message: 'Profile image removed successfully',
  });
};
