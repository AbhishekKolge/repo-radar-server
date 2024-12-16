import { z } from 'zod';

export const updatePreferenceSchema = z.object({
  input: z.object({
    releaseAlert: z.boolean(),
    loginEmailAlert: z.boolean(),
  }),
});
