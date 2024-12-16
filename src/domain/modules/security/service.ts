import { Prisma, Security } from '@prisma/client';
import { prisma } from 'src/infrastructure/database';
import { NotFoundError } from 'src/infrastructure/error';

export class SecurityService {
  public async getSecurityByUserId(userId: string): Promise<Security> {
    const security = await prisma.security.findUnique({
      where: { userId },
    });

    if (!security) {
      throw new NotFoundError('Security settings not found');
    }

    return security;
  }

  public async updateSecurityByUserId(
    userId: string,
    data: Prisma.SecurityUncheckedUpdateInput,
  ): Promise<Security> {
    const security = await prisma.security.update({
      data,
      where: {
        userId,
      },
    });
    return security;
  }
}
