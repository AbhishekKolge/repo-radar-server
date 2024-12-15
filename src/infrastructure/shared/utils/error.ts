import { Prisma } from '@prisma/client';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodFormattedError } from 'zod';
import { CustomAPIError } from 'src/infrastructure/error';
import { logger } from 'src/infrastructure/logging';
import { GRAPHQL_CODE_STATUS_MAP } from 'src/shared/utils';

export const formatZodErrors = (error: ZodError): string => {
  const formattedErrors: string[] = [];

  const extractFirstErrors = (errorObj: ZodFormattedError<unknown>, prefix: string = ''): void => {
    if (errorObj._errors?.length) {
      const errorMessage = prefix ? `${prefix}: ${errorObj._errors[0]}` : errorObj._errors[0];
      formattedErrors.push(errorMessage);
    }

    Object.entries(errorObj).forEach(([key, value]) => {
      if (key !== '_errors' && value && typeof value === 'object') {
        extractFirstErrors(value as unknown as ZodFormattedError<unknown>, key);
      }
    });
  };

  extractFirstErrors(error.format());

  return formattedErrors[0];
};

export const formatGraphQLError = (
  formattedError: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError => {
  logger.error('Unexpected error type in GraphQL error formatting', formattedError);

  if (error instanceof GraphQLError) {
    if (error.originalError instanceof CustomAPIError) {
      const customError = error.originalError as CustomAPIError;
      return {
        ...formattedError,
        message: customError.message,
        extensions: {
          ...formattedError.extensions,
          statusCode: customError.statusCode,
          code: 'CUSTOM_ERROR',
        },
      };
    }

    if (error.originalError instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaError = formatPrismaError(error.originalError);
      return {
        ...formattedError,
        message: prismaError.message,
        extensions: {
          ...formattedError.extensions,
          statusCode: prismaError.statusCode,
          code: 'PRISMA_ERROR',
        },
      };
    }

    if (error.originalError instanceof ZodError) {
      const zodErrors = formatZodErrors(error.originalError);

      return {
        ...formattedError,
        message: zodErrors || 'Validation failed',
        extensions: {
          ...formattedError.extensions,
          statusCode: StatusCodes.BAD_REQUEST,
          code: 'ZOD_ERROR',
        },
      };
    }

    if (error.message.includes('Input validation failed')) {
      return {
        ...formattedError,
        message: 'Invalid input provided',
        extensions: {
          ...formattedError.extensions,
          statusCode: StatusCodes.BAD_REQUEST,
          code: 'INPUT_VALIDATION_ERROR',
        },
      };
    }
  }

  const statusCode =
    formattedError.extensions?.code && typeof formattedError.extensions.code === 'string'
      ? (GRAPHQL_CODE_STATUS_MAP[formattedError.extensions.code] ??
        StatusCodes.INTERNAL_SERVER_ERROR)
      : StatusCodes.INTERNAL_SERVER_ERROR;

  return {
    ...formattedError,
    message: formattedError.message || 'Something went wrong, please try again',
    extensions: {
      ...formattedError.extensions,
      statusCode,
    },
  };
};

export const formatPrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  const customError = {
    message: err.message || 'Something went wrong, please try again',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  };

  switch (err.code) {
    case 'P2000': {
      const key = err.meta?.column_name || 'Value';
      customError.message = `${key} is too long`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
      break;
    }
    case 'P2001': {
      customError.message = 'Not found';
      customError.statusCode = StatusCodes.NOT_FOUND;
      break;
    }
    case 'P2002': {
      if (Array.isArray(err.meta?.target) && err.meta.target.length > 0) {
        const key = err.meta.target[0];
        customError.message = `Provided ${key} already exists`;
      } else {
        customError.message = 'Provided value already exists';
      }
      customError.statusCode = StatusCodes.CONFLICT;
      break;
    }
    case 'P2003': {
      const key = err.meta?.field_name || 'Field';
      customError.message = `${key} does not exist`;
      customError.statusCode = StatusCodes.NOT_FOUND;
      break;
    }
    case 'P2025': {
      customError.message = 'No record found to delete';
      customError.statusCode = StatusCodes.NOT_FOUND;
      break;
    }
    default: {
      customError.message = 'Something went wrong, please try again';
      customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }
  return customError;
};
