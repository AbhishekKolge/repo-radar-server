import { StatusCodes } from 'http-status-codes';
import { env } from 'src/infrastructure/config';

export const LOGGER_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
export const LOGGER_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
export const WHITELIST_ENDPOINTS = [env.FRONT_END_ORIGIN, env.LOCAL_FRONT_END_ORIGIN];
export const MAX_IMAGE_SIZE = 1024 * 1024;
export const GRAPHQL_CODE_STATUS_MAP: Record<string, number> = {
  GRAPHQL_PARSE_FAILED: StatusCodes.BAD_REQUEST,
  GRAPHQL_VALIDATION_FAILED: StatusCodes.BAD_REQUEST,
  BAD_USER_INPUT: StatusCodes.BAD_REQUEST,
  PERSISTED_QUERY_NOT_FOUND: StatusCodes.BAD_REQUEST,
  PERSISTED_QUERY_NOT_SUPPORTED: StatusCodes.BAD_REQUEST,
  OPERATION_RESOLUTION_FAILURE: StatusCodes.BAD_REQUEST,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
};
