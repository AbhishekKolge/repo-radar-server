import { OWNER_TYPE } from '../types';

export const getOwnerType = (value: string) => {
  return value === 'User' ? OWNER_TYPE.USER : OWNER_TYPE.ORGANIZATION;
};
