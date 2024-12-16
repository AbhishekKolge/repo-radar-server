import { CountryService } from './service';

export const getCountries = () => {
  const countryService = new CountryService();
  return countryService.getCountries();
};
