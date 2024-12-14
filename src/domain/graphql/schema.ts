import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import gql from 'graphql-tag';
import { userResolvers } from '../modules/user/resolvers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userSchema = gql(
  fs.readFileSync(path.join(__dirname, '../modules/user/schema.graphql'), 'utf-8'),
);

const typeDefs = mergeTypeDefs([userSchema]);
const resolvers = mergeResolvers([userResolvers]);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
