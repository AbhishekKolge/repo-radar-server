import { z } from 'zod';
import { GITHUB_URL_REGEX } from 'src/shared/utils';

export const addRepositorySchema = z.object({
  input: z.object({
    url: z
      .string()
      .url({ message: 'Invalid Github repository URL' })
      .refine(
        (url) => {
          return GITHUB_URL_REGEX.test(url);
        },
        { message: 'Invalid Github repository URL' },
      ),
  }),
});

export const repositoriesQuerySchema = z.object({
  query: z
    .object({
      page: z.number().optional().nullable(),
      sortKey: z.string().trim().optional().nullable(),
      sortMethod: z.string().trim().optional().nullable(),
      search: z.string().trim().optional().nullable(),
      archived: z.boolean().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const updateRepositoryStatusSchema = z.object({
  id: z.string(),
  input: z.object({
    archived: z.boolean(),
  }),
});
