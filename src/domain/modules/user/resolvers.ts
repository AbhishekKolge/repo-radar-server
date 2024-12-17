import { CountryService } from '../utils/service';
import { UserService } from './service';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const userResolvers: Resolvers = {
  Query: {
    profile: (_root, _, { user }) => {
      const userService = new UserService();
      return userService.getUserById((user as AuthUser).id);
    },
  },
  Mutation: {
    updateProfile: (_root, { input: details }, { user }) => {
      const userService = new UserService();
      return userService.updateUserById((user as AuthUser).id, details);
    },
  },

  User: {
    contactCountry: (user) => {
      if (!user.contactCountryId) {
        return null;
      }
      const countryService = new CountryService();
      return countryService.getCountryById(user.contactCountryId);
    },
    dob: (user) => {
      if (user.dob) {
        return user.dob.toISOString();
      }
      return null;
    },
  },
};
