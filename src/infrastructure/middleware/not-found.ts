import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFound = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Route does not exist' });
};
