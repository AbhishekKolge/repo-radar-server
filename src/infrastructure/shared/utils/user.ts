import { TokenUser } from '../types';
import { env } from 'src/infrastructure/config';

export const checkTestUser = (userId: string): boolean => {
  const isTestUser = userId === env.TEST_USER_ID;
  return isTestUser;
};

export const createTokenUser = <T extends { id: string }>(user: T): TokenUser => {
  return { id: user.id };
};
