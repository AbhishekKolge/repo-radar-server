import { Request, Response, NextFunction } from 'express';
import rateLimiter from 'express-rate-limit';
import { isProduction } from '../config';
import { logger } from '../logging';

const noRateLimiter = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

export const rateLimiterSetup = isProduction
  ? rateLimiter({
      windowMs: 60 * 1000,
      max: 30,
      message: 'You have exceeded your 30 requests per minute limit.',
      standardHeaders: true,
      legacyHeaders: false,
    })
  : noRateLimiter;

if (!isProduction) {
  logger.info('Rate limiting is disabled in non-production environment.');
}
