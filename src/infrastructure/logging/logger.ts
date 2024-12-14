import { StreamOptions } from 'morgan';
import {
  Logger,
  createLogger,
  addColors,
  format as winstonFormat,
  transports as winstonTransports,
  LeveledLogMethod,
} from 'winston';
import { env } from '../config';
import { LOGGER_COLORS, LOGGER_LEVELS } from 'src/shared/utils';

addColors(LOGGER_COLORS);

const format = winstonFormat.combine(
  winstonFormat.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winstonFormat.colorize({ all: true }),
  winstonFormat.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transports = [new winstonTransports.Console()];

const customLogger: Logger = createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels: LOGGER_LEVELS,
  format,
  transports,
});

export const morganStream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

export const logger: Logger & Record<keyof typeof LOGGER_LEVELS, LeveledLogMethod> = customLogger;
