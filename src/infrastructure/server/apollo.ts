import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Application } from 'express';
import { env } from '../config';
import { errorHandler, notFound } from '../middleware';
import { formatGraphQLError } from '../shared/utils';
import { getContext, schema } from 'src/domain/graphql';

export const createApolloServer = async (): Promise<ApolloServer> => {
  const server = new ApolloServer({
    schema,
    formatError: formatGraphQLError,
    includeStacktraceInErrorResponses: env.NODE_ENV !== 'production',
  });

  await server.start();
  return server;
};

export const setupApolloMiddleware = (app: Application, server: ApolloServer): void => {
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: getContext,
    }),
  );

  app.use(errorHandler);
  app.use(notFound);
};
