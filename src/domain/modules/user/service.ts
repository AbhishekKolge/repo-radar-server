import fs from 'fs/promises';
import { User, Prisma } from '@prisma/client';
import { Request } from 'express';
import { UploadedFile } from 'express-fileupload';
import { UpdateProfileImageResponse } from './types';
import { UploadService } from 'src/domain/services';
import { prisma } from 'src/infrastructure/database';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from 'src/infrastructure/error';
import { logger } from 'src/infrastructure/logging';
import { AuthUser } from 'src/infrastructure/shared/types';
import {
  checkTimeExpired,
  hashString,
  createRandomOtp,
  getCodeExpirationTimeOffset,
  checkResourcePermissions,
} from 'src/shared/utils';

export class UserService {
  private async getUserById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('User does not exist, please register');
    }

    return user;
  }

  private async updateUserById(id: string, data: Prisma.UserUpdateInput): Promise<void> {
    await prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  public async getEmailVerificationOtp(
    authUser: AuthUser,
  ): Promise<User & { verificationCode: string }> {
    const user = await this.getUserById(authUser.id);

    if (!user.email) {
      throw new BadRequestError('No email found, please provide an email ID');
    }
    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified');
    }

    this.checkEmailVerificationCodeValidity(user);
    const verificationCode = createRandomOtp();
    logger.info({ verificationCode });

    await this.updateUserById(authUser.id, {
      emailVerificationCode: hashString(verificationCode),
      emailVerificationCodeExpiration: getCodeExpirationTimeOffset(),
    });

    return { ...user, verificationCode };
  }

  public async verifyEmail(authUser: AuthUser, code: string): Promise<void> {
    const user = await this.getUserById(authUser.id);
    if (user.isEmailVerified) {
      throw new BadRequestError('Email is already verified');
    }
    this.compareEmailVerificationCode(user, code);
    await this.updateUserById(authUser.id, {
      isEmailVerified: true,
      emailVerificationCode: null,
      emailVerificationCodeExpiration: null,
    });
  }

  public async updateProfileImage(req: Request): Promise<UpdateProfileImageResponse> {
    const image = req.files?.profileImage as UploadedFile;
    try {
      const authUser = req.user as AuthUser;
      const user = await this.getUserById(authUser.id);
      const oldProfileImageId = user.profileImageId;
      const uploadService = new UploadService();
      const result = await uploadService.uploadImage('profileImage', 'profile-images', req);
      await this.updateUserById(authUser.id, {
        profileImageUrl: result.secure_url,
        profileImageId: result.public_id,
      });
      if (oldProfileImageId) {
        await uploadService.deleteImage(oldProfileImageId);
      }
      return {
        profileImageUrl: result.secure_url,
      };
    } catch (error) {
      if (image?.tempFilePath) {
        await fs.unlink(image.tempFilePath);
      }
      throw error;
    }
  }

  public async deleteProfileImage(authUser: AuthUser, imageId: string): Promise<void> {
    const user = await this.getUserById(authUser.id);

    if (!user.profileImageId) {
      throw new NotFoundError(`No file found with id of ${imageId}`);
    }

    checkResourcePermissions(user.profileImageId, imageId);

    await this.updateUserById(authUser.id, {
      profileImageUrl: null,
      profileImageId: null,
    });

    const uploadService = new UploadService();
    await uploadService.deleteImage(imageId);
  }

  private compareEmailVerificationCode(user: User, code: string): void {
    if (!user.emailVerificationCodeExpiration || !user.emailVerificationCode) {
      throw new UnauthorizedError('Please generate verification code');
    }
    const isExpired = checkTimeExpired(user.emailVerificationCodeExpiration);

    if (isExpired) {
      throw new UnauthorizedError('Verification code has expired');
    }

    const isMatch = user.emailVerificationCode === hashString(code);

    if (!isMatch) {
      throw new UnauthorizedError('Verification failed');
    }
  }

  private checkEmailVerificationCodeValidity(user: User): void {
    if (user.emailVerificationCodeExpiration) {
      const isExpired = checkTimeExpired(user.emailVerificationCodeExpiration);
      if (!isExpired && user.emailVerificationCode) {
        throw new ConflictError('Verification code already sent');
      }
    }
  }
}
