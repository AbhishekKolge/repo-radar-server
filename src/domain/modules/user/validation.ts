import { z } from 'zod';

export const verifyEmailSchema = z.object({
  body: z.object({
    code: z
      .string()
      .trim()
      .length(6, {
        message: 'Code must be exactly 6 digits',
      })
      .regex(/^\d+$/, { message: 'Code must only contain numbers' }),
  }),
});

export const removeProfileImageSchema = z.object({
  query: z.object({
    imageId: z.string().trim().min(1, {
      message: 'Image ID is required',
    }),
  }),
});

export const createUserSchema = z.object({
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});
