import { Notification, Prisma } from '@prisma/client';
import { prisma } from 'src/infrastructure/database';
import { NotFoundError } from 'src/infrastructure/error';

export class PreferenceService {
  public async getPreferenceByUserId(userId: string): Promise<Notification> {
    const preference = await prisma.notification.findUnique({
      where: { userId },
    });

    if (!preference) {
      throw new NotFoundError('Preference settings not found');
    }

    return preference;
  }

  public async updatePreferenceByUserId(
    userId: string,
    data: Prisma.NotificationUncheckedUpdateInput,
  ): Promise<Notification> {
    const preference = await prisma.notification.update({
      data,
      where: {
        userId,
      },
    });
    return preference;
  }
}
