import { getUserSecurity, updateUserSecurity } from './controller';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const securityResolvers: Resolvers = {
  Query: {
    security: (_root, _, { user }) => {
      return getUserSecurity(user as AuthUser);
    },
  },
  Mutation: {
    updateSecurity: (_root, { input: details }, { user }) => {
      return updateUserSecurity(user as AuthUser, details);
    },
  },

  Security: {
    updatedAt: (security) => {
      return security.updatedAt.toISOString();
    },
  },
};
