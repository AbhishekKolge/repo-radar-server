import { User, Prisma, Notification, Security } from '@prisma/client';
import { GithubProfileDto } from './types';
import { OctokitService, UploadService } from 'src/domain/services';
import { prisma } from 'src/infrastructure/database';
import { currentTime } from 'src/shared/utils';

export class AuthService {
  private async findOrCreateUser(githubProfile: GithubProfileDto): Promise<
    Prisma.UserGetPayload<{
      include: {
        notification: true;
        security: true;
      };
    }>
  > {
    const user = await prisma.user.findUnique({
      where: { username: githubProfile.username },
      include: { notification: true, security: true },
    });

    if (!user) {
      return this.createUser(githubProfile);
    }

    return user;
  }

  private async createUser(githubProfile: GithubProfileDto): Promise<
    Prisma.UserGetPayload<{
      include: {
        notification: true;
        security: true;
      };
    }>
  > {
    const { name, username, profileImageUrl, accessToken } = githubProfile;

    const octokitService = new OctokitService(accessToken);
    const email = await octokitService.getPrimaryVerifiedEmail();

    const userCreateInput: Prisma.UserCreateInput = {
      name,
      email,
      username,
      profileImageUrl: profileImageUrl,
      verifiedAt: currentTime(),
      isEmailVerified: !!email,
      notification: { create: {} },
      security: { create: {} },
    };

    if (profileImageUrl) {
      const uploadService = new UploadService();
      const result = await uploadService.uploadGithubImage(profileImageUrl, 'profile-images');
      userCreateInput.profileImageUrl = result.secure_url;
      userCreateInput.profileImageId = result.public_id;
    }

    return prisma.user.create({
      data: userCreateInput,
      include: { notification: true, security: true },
    });
  }

  public handleGithubLogin(githubProfile: GithubProfileDto): Promise<
    Prisma.UserGetPayload<{
      include: {
        notification: true;
        security: true;
      };
    }>
  > {
    return this.findOrCreateUser(githubProfile);
  }
}
