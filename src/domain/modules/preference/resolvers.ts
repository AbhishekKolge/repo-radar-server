import { getUserPreference, updateUserPreference } from './controller';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const preferenceResolvers: Resolvers = {
  Query: {
    preference: (_root, _, { user }) => {
      return getUserPreference(user as AuthUser);
    },
  },
  Mutation: {
    updatePreference: (_root, { input: details }, { user }) => {
      return updateUserPreference(user as AuthUser, details);
    },
  },

  Preference: {
    updatedAt: (preference) => {
      return preference.updatedAt.toISOString();
    },
  },
};
