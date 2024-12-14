import express from 'express';

export const createExpressApp = (): express.Application => {
  const app = express();

  app.use(express.json());

  return app;
};
