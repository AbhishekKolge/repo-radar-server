import { Repository } from '@prisma/client';
import { z } from 'zod';
import { addRepositorySchema, updateRepositoryStatusSchema } from '../validation';

export type AddUserRepositoryBody = z.infer<typeof addRepositorySchema.shape.input>;

export type updateUserRepositoryStatusBody = z.infer<
  typeof updateRepositoryStatusSchema.shape.input
>;

export interface ExtractedRepositoryDetails {
  owner: string;
  repo: string;
}

export enum OWNER_TYPE {
  ORGANIZATION = 'ORGANIZATION',
  USER = 'USER',
}

export interface GetUserRepositoriesResponse {
  data: Repository[];
  totalCount: number;
  totalPages: number;
}

export interface CommitResponse {
  id: string;
  url: string;
  committer?: string;
  author?: string;
  message: string;
  verified?: boolean;
}
