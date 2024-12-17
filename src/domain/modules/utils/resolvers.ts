import { CountryService } from './service';
import { Resolvers } from 'src/domain/graphql';

export const utilsResolvers: Resolvers = {
  Query: {
    countries: () => {
      const countryService = new CountryService();
      return countryService.getCountries();
    },
  },
};
