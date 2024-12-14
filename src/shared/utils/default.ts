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
