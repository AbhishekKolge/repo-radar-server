import 'express-async-errors';

import express from 'express';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import morgan from 'morgan';
import { isProduction } from '../config';
import { morganStream } from '../logging';
import { corsSetup, rateLimiterSetup } from '../middleware';
import { authRouter } from 'src/domain/modules/auth/routes';
import { userRouter } from 'src/domain/modules/user/routes';

export const createExpressApp = (): express.Application => {
  const app = express();

  app.set('trust proxy', 1);
  if (isProduction) {
    app.use(helmet());
  }
  app.use(express.json());
  app.use(corsSetup);
  app.use(
    fileUpload({
      useTempFiles: true,
    }),
  );
  app.use(morgan('combined', { stream: morganStream }));
  app.use(rateLimiterSetup);

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/user', userRouter);

  return app;
};
