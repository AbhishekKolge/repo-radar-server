import { z } from 'zod';
import { verifyEmailSchema } from '../validation';

export interface UpdateProfileImageResponse {
  profileImageUrl: string;
}

export type VerifyEmailRequestBody = z.infer<typeof verifyEmailSchema.shape.body>;
