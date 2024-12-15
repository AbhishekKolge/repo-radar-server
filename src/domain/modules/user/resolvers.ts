import { Resolvers } from 'src/domain/graphql';

export const userResolvers: Resolvers = {
  Query: {
    user: (_root, _, { user }) => {
      console.log(user);

      return null;
    },
  },
  Mutation: {
    createUser: (_root, { input }) => {
      console.log({ input });

      return null;
    },
  },
};
