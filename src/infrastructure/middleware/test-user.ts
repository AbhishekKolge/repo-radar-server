import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../error';

export const isTestUser = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.isTestUser) {
    throw new UnauthorizedError("Test user can't perform this action");
  }
  next();
};
