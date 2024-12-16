import { z } from 'zod';

export const updateSecuritySchema = z.object({
  input: z.object({
    twoFactorAuth: z.boolean(),
  }),
});
