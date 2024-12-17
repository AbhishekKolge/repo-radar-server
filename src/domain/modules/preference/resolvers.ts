import { PreferenceService } from './service';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const preferenceResolvers: Resolvers = {
  Query: {
    preference: (_root, _, { user }) => {
      const preferenceService = new PreferenceService();
      return preferenceService.getPreferenceByUserId((user as AuthUser).id);
    },
  },
  Mutation: {
    updatePreference: (_root, { input: details }, { user }) => {
      const preferenceService = new PreferenceService();
      return preferenceService.updatePreferenceByUserId((user as AuthUser).id, details);
    },
  },

  Preference: {
    updatedAt: (preference) => {
      return preference.updatedAt.toISOString();
    },
  },
};
