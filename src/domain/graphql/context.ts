import { Request } from 'express';
import { ResolverContext } from '../shared/types';

export const getContext = ({ req }: { req: Request }): Promise<ResolverContext> => {
  const context: ResolverContext = {};
  if (req.user) {
    context.user = {
      ...req.user,
    };
  }
  return Promise.resolve(context);
};
