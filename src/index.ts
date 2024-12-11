import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import schema from './graphql/schema';
import { createCompanyLoader } from './modules/user/controller';
import { ResolverContext } from './types/graphql';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

function getContext(): Promise<ResolverContext> {
  const companyLoader = createCompanyLoader();
  const context: ResolverContext = { companyLoader };
  context.user = {
    id: '123',
    isTestUser: true,
  };
  return Promise.resolve(context);
}

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

app.listen(8000, () => {
  console.info(`Running on Port 8000`);
});
