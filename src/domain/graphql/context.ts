import { Request } from 'express';
import {
  createReleaseInfoLoader,
  createRepositoryStatusLoader,
  createRepositoryCommitsLoader,
} from '../modules/repository/loaders';
import { ResolverContext } from '../shared/types';
import { UnauthenticatedError } from 'src/infrastructure/error';
import { AuthUser } from 'src/infrastructure/shared/types';
import { checkTestUser, isTokenValid } from 'src/infrastructure/shared/utils';

export const getContext = ({ req }: { req: Request }): Promise<ResolverContext> => {
  const releaseInfoLoader = createReleaseInfoLoader();
  const repositoryStatusLoader = createRepositoryStatusLoader();
  const context: ResolverContext = {
    releaseInfoLoader,
    repositoryStatusLoader,
  };
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthenticatedError('Authentication invalid');
    }

    try {
      const user = isTokenValid(token);
      const isTestUser = checkTestUser(user.id);
      context.user = {
        id: user.id,
        githubToken: user.githubToken,
        isTestUser,
      } as AuthUser;
      if (user.githubToken) {
        const repositoryCommitsLoader = createRepositoryCommitsLoader(user.githubToken);
        context.repositoryCommitsLoader = repositoryCommitsLoader;
      }
    } catch {
      throw new UnauthenticatedError('Authentication invalid');
    }
  }

  return Promise.resolve(context);
};
