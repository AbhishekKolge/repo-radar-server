import { UnauthorizedError } from 'src/infrastructure/error';

export const checkResourcePermissions = (requestUserId: string, resourceUserId: string) => {
  if (requestUserId === resourceUserId) return;
  throw new UnauthorizedError('Not authorized to access');
};
