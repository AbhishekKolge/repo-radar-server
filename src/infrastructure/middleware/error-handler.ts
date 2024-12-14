import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../error';
import { logger } from '../logging';
import { formatPrismaError } from '../shared/utils';

export const errorHandler = (
  err: Error | CustomAPIError | Prisma.PrismaClientKnownRequestError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let customError = {
    message: err.message || 'Something went wrong, please try again',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err instanceof CustomAPIError) {
    customError.message = err.message;
    customError.statusCode = err.statusCode;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    customError = formatPrismaError(err);
  }

  res.status(customError.statusCode).json({ message: customError.message });

  logger.error(err);
};
