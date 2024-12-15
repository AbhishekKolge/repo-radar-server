import { Request } from 'express';
import { ResolverContext } from '../shared/types';
import { AuthUser } from 'src/infrastructure/shared/types';

export const getContext = ({ req }: { req: Request }): Promise<ResolverContext> => {
  const context: ResolverContext = {};
  if (req.user) {
    context.user = {
      ...req.user,
    } as AuthUser;
  }
  return Promise.resolve(context);
};
