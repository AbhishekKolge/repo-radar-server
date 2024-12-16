import { getUser, getUserContactCountry, updateUser } from './controllers';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const userResolvers: Resolvers = {
  Query: {
    profile: (_root, _, { user }) => {
      return getUser(user as AuthUser);
    },
  },
  Mutation: {
    updateProfile: (_root, { input: details }, { user }) => {
      return updateUser(user as AuthUser, details);
    },
  },

  User: {
    contactCountry: (user) => {
      return getUserContactCountry(user.contactCountryId);
    },
    dob: (user) => {
      if (user.dob) {
        return user.dob.toISOString();
      }
      return null;
    },
  },
};
