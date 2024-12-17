import { SecurityService } from './service';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const securityResolvers: Resolvers = {
  Query: {
    security: (_root, _, { user }) => {
      const securityService = new SecurityService();
      return securityService.getSecurityByUserId((user as AuthUser).id);
    },
  },
  Mutation: {
    updateSecurity: (_root, { input: details }, { user }) => {
      const securityService = new SecurityService();
      return securityService.updateSecurityByUserId((user as AuthUser).id, details);
    },
  },

  Security: {
    updatedAt: (security) => {
      return security.updatedAt.toISOString();
    },
  },
};
