import { z } from 'zod';
import { repositoriesQuerySchema } from '../validation';

export type GetUserRepositoriesQuery = z.infer<typeof repositoriesQuerySchema.shape.query>;
