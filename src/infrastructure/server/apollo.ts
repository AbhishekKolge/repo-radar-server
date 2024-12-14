import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Application } from 'express';
import { getContext } from 'src/domain/graphql/context';
import schema from 'src/domain/graphql/schema';

export const createApolloServer = async (): Promise<ApolloServer> => {
  const server = new ApolloServer({
    schema,
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
};
