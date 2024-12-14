import { ResolverContext } from '../shared/types/graphql';

export const getContext = (): Promise<ResolverContext> => {
  //   const companyLoader = createCompanyLoader();
  //   const context: ResolverContext = { companyLoader };
  const context: ResolverContext = {};
  context.user = {
    id: '123',
    isTestUser: true,
  };
  return Promise.resolve(context);
};
