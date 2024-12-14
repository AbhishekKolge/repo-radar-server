import fs from 'fs';
import csv from 'csv-parser';
import { prisma } from '../infrastructure/database';
import { CountryCache, CountryRow } from './types';
import { logger } from 'src/infrastructure/logging';

const filePath: string = 'data/country.csv';
const countryCache: CountryCache = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', async (row: CountryRow) => {
    try {
      const name: string = row[Object.keys(row)[0]].trim();
      const shortName: string = row.A2.trim();
      const phoneCode: string = row.dialCode.trim();

      if (name && shortName && phoneCode) {
        const cachedCountry = countryCache[shortName];

        if (!cachedCountry) {
          const countryData = await prisma.country.findUnique({
            where: { shortName },
          });

          if (!countryData) {
            await prisma.country.create({
              data: { name, shortName, phoneCode },
            });
            countryCache[shortName] = shortName;
          } else {
            countryCache[shortName] = shortName;
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error('Error processing row:', error.message);
      } else {
        logger.error('An unknown error occurred:', error);
      }
    }
  })
  .on('end', () => {
    logger.info('Country seeding completed');
  });
