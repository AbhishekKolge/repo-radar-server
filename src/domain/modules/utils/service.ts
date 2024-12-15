import { Country } from '@prisma/client';
import { prisma } from 'src/infrastructure/database';

export class CountryService {
  async getCountries(): Promise<Country[]> {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    if (!countries.length) {
      return [];
    }

    return countries;
  }

  async getCountryById(id: string): Promise<Country | null> {
    const country = await prisma.country.findUnique({
      where: {
        id,
      },
    });
    return country;
  }
}
