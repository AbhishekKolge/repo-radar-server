import { getCountries } from './controller';
import { Resolvers } from 'src/domain/graphql';

export const utilsResolvers: Resolvers = {
  Query: {
    countries: () => {
      return getCountries();
    },
  },
};
