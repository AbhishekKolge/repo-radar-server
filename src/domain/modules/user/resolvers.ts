import { getUser } from './controllers';
import { Resolvers } from 'src/domain/graphql';

export const userResolvers: Resolvers = {
  Query: {
    user: async () => {
      const job = await getUser();

      return job;
    },
  },

  User: {
    date: (user) => user.createdAt,
  },
};
