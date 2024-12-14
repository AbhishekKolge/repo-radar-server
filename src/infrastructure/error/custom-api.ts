import { StatusCodes } from 'http-status-codes';

export class CustomAPIError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
