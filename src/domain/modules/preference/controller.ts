import { Prisma } from '@prisma/client';
import { PreferenceService } from './service';
import { AuthUser } from 'src/infrastructure/shared/types';

export const getUserPreference = (authUser: AuthUser) => {
  const preferenceService = new PreferenceService();
  return preferenceService.getPreferenceByUserId(authUser.id);
};

export const updateUserPreference = (
  authUser: AuthUser,
  data: Prisma.NotificationUncheckedUpdateInput,
) => {
  const preferenceService = new PreferenceService();
  return preferenceService.updatePreferenceByUserId(authUser.id, data);
};
