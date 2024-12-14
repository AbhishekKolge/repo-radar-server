import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../logging';
import { formatZodErrors } from '../shared/utils';

export const validateRequest =
  <T extends { body?: unknown; query?: unknown; params?: unknown }>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        res.status(StatusCodes.BAD_REQUEST).json({
          message: formattedErrors,
        });
        logger.error(formattedErrors);
      } else {
        next(error);
      }
    }
  };
