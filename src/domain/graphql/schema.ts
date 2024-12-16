import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import gql from 'graphql-tag';
import { preferenceResolvers } from '../modules/preference/resolvers';
import { securityResolvers } from '../modules/security/resolvers';
import { userResolvers } from '../modules/user/resolvers';
import { utilsResolvers } from '../modules/utils/resolvers';
import { authDirectiveTransformer, validateDirectiveTransformer } from './directives';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userSchema = gql(
  fs.readFileSync(path.join(__dirname, '../modules/user/schema.graphql'), 'utf-8'),
);
const utilsSchema = gql(
  fs.readFileSync(path.join(__dirname, '../modules/utils/schema.graphql'), 'utf-8'),
);
const securitySchema = gql(
  fs.readFileSync(path.join(__dirname, '../modules/security/schema.graphql'), 'utf-8'),
);
const preferenceSchema = gql(
  fs.readFileSync(path.join(__dirname, '../modules/preference/schema.graphql'), 'utf-8'),
);

const typeDefs = mergeTypeDefs([userSchema, utilsSchema, securitySchema, preferenceSchema]);
const resolvers = mergeResolvers([
  userResolvers,
  utilsResolvers,
  securityResolvers,
  preferenceResolvers,
]);

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = authDirectiveTransformer(schema);
schema = validateDirectiveTransformer(schema);

export { schema };
