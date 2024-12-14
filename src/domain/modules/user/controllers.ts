import { UserEntity } from './types/entity';

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
