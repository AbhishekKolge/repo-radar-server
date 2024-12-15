import { Request, Response } from 'express';
import { UserService } from './service';
import { GithubProfileDto } from './types';
import { NotificationService } from 'src/domain/services';
import { createTokenUser, getJWTToken } from 'src/infrastructure/shared/utils';

export const githubLogin = async (req: Request, res: Response) => {
  try {
    const githubProfile = req.user as GithubProfileDto;
    const userService = new UserService();

    const user = await userService.handleGithubLogin(githubProfile);

    const tokenUser = createTokenUser({ ...user, githubToken: githubProfile.accessToken });
    const token = getJWTToken(tokenUser);

    const success = {
      token,
      success: String(true),
    };

    const successQueryString = new URLSearchParams(success).toString();

    res.redirect(`${process.env.FRONT_END_ORIGIN}/auth/github?${successQueryString}`);

    if (user.notification.loginEmailAlert) {
      const notificationService = new NotificationService();
      notificationService.sendLoginAlertNotificationEmail(user);
    }
  } catch {
    const failure = {
      success: String(false),
    };
    const failureQueryString = new URLSearchParams(failure).toString();
    res.redirect(`${process.env.FRONT_END_ORIGIN}/auth/github?${failureQueryString}`);
  }
};
