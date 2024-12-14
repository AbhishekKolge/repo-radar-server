import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../error';
import { checkTestUser, isTokenValid } from '../shared/utils';

export const authenticateUser = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  try {
    const user = isTokenValid(token);
    const isTestUser = checkTestUser(user.id);
    req.user = { id: user.id, isTestUser };
    return next();
  } catch {
    throw new UnauthenticatedError('Authentication invalid');
  }
};
