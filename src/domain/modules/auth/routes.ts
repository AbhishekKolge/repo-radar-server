import express from 'express';
import { githubLogin } from './controllers';
import { passport } from './strategies';
import { GITHUB_FAILURE_REDIRECT, GITHUB_SCOPE, GITHUB_SESSION } from 'src/domain/shared/utils';

export const authRouter = express.Router();

authRouter.route('/github').get(passport.authenticate('github', { scope: GITHUB_SCOPE }));
authRouter.route('/github/callback').get(
  passport.authenticate('github', {
    failureRedirect: GITHUB_FAILURE_REDIRECT,
    session: GITHUB_SESSION,
  }),
  githubLogin,
);
