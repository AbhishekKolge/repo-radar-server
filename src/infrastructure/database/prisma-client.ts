import { PrismaClient } from '@prisma/client';
import { isProduction } from '../config';
import { logger } from '../logging';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
      });
    }
    return Database.instance;
  }

  public static async connect(): Promise<void> {
    try {
      const prisma = Database.getInstance();
      await prisma.$connect();
      logger.info('Successfully connected to database');
    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  public static async disconnect(): Promise<void> {
    try {
      await Database.instance?.$disconnect();
      logger.info('Successfully disconnected from database');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }
}

const prisma = isProduction ? Database.getInstance() : global.prisma || Database.getInstance();

if (!isProduction) {
  global.prisma = prisma;
}

export { prisma };
export const connectPrisma = Database.connect;
export const disconnectPrisma = Database.disconnect;
