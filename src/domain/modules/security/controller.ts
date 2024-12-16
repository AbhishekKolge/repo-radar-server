import { Prisma } from '@prisma/client';
import { SecurityService } from './service';
import { AuthUser } from 'src/infrastructure/shared/types';

export const getUserSecurity = (authUser: AuthUser) => {
  const securityService = new SecurityService();
  return securityService.getSecurityByUserId(authUser.id);
};

export const updateUserSecurity = (
  authUser: AuthUser,
  data: Prisma.SecurityUncheckedUpdateInput,
) => {
  const securityService = new SecurityService();
  return securityService.updateSecurityByUserId(authUser.id, data);
};
