import { CountryService } from './service';

export const getCountries = async () => {
  const countryService = new CountryService();
  const data = await countryService.getCountries();
  return data;
};
