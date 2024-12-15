import { User, Prisma, Notification, Security } from '@prisma/client';
import { GithubProfileDto } from './types';
import { UploadService } from 'src/domain/services';
import { prisma } from 'src/infrastructure/database';
import { currentTime } from 'src/shared/utils';

export class AuthService {
  private async findOrCreateUser(
    githubProfile: GithubProfileDto,
  ): Promise<User & { notification: Notification; security: Security }> {
    const user = await prisma.user.findUnique({
      where: { username: githubProfile.username },
      include: { notification: true, security: true },
    });

    if (!user) {
      return this.createUser(githubProfile);
    }

    return user;
  }

  private async createUser(
    githubProfile: GithubProfileDto,
  ): Promise<User & { notification: Notification; security: Security }> {
    const { name, username, profileImageUrl } = githubProfile;

    const userCreateInput: Prisma.UserCreateInput = {
      name,
      username,
      profileImageUrl: profileImageUrl,
      verifiedAt: currentTime(),
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

  public handleGithubLogin(
    githubProfile: GithubProfileDto,
  ): Promise<User & { notification: Notification; security: Security }> {
    return this.findOrCreateUser(githubProfile);
  }
}
