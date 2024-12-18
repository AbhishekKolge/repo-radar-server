import { Request, Response } from 'express';
import { AuthService } from './service';
import { GithubProfileDto } from './types';
import { NotificationService } from 'src/domain/services';
import { logger } from 'src/infrastructure/logging';
import { createTokenUser, getJWTToken } from 'src/infrastructure/shared/utils';

export const githubLogin = async (req: Request, res: Response) => {
  try {
    const githubProfile = req.user as GithubProfileDto;
    const authService = new AuthService();

    const user = await authService.handleGithubLogin(githubProfile);

    const tokenUser = createTokenUser({ ...user, githubToken: githubProfile.accessToken });
    const token = getJWTToken(tokenUser);

    const success = {
      success: String(true),
      id: user.id,
      username: user.username,
      profileImageUrl: String(user.profileImageUrl),
      token,
    };

    const successQueryString = new URLSearchParams(success).toString();

    res.redirect(`${process.env.FRONT_END_ORIGIN}/auth/github?${successQueryString}`);

    if (user.notification?.loginEmailAlert && user.isEmailVerified) {
      const notificationService = new NotificationService();
      notificationService.sendLoginAlertNotificationEmail(user);
    }
  } catch (error) {
    const failure = {
      success: String(false),
    };
    const failureQueryString = new URLSearchParams(failure).toString();
    res.redirect(`${process.env.FRONT_END_ORIGIN}/auth/github?${failureQueryString}`);
    logger.error(error);
  }
};
