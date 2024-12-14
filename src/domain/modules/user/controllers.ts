import { UserEntity } from './types';

export const getUser = (): Promise<UserEntity> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        title: 'title',
        description: 'description',
        createdAt: 'createdAt',
      });
    }, 2000);
  });
};
