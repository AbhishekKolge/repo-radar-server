import cors, { CorsOptions } from 'cors';
import { Request } from 'express';
import { WHITELIST_ENDPOINTS } from 'src/shared/utils';

const corsOptionsDelegate = function (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void,
): void {
  let corsOptions: CorsOptions;
  const origin = req.header('Origin') || '';

  if (WHITELIST_ENDPOINTS.indexOf(origin) !== -1) {
    corsOptions = {
      origin,
      optionsSuccessStatus: 204,
      credentials: true,
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export const corsSetup = cors(corsOptionsDelegate);
