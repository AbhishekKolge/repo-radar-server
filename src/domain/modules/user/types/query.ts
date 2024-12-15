import { z } from 'zod';
import { removeProfileImageSchema } from '../validation';

export type RemoveProfileImageRequestQuery = z.infer<typeof removeProfileImageSchema.shape.query>;
