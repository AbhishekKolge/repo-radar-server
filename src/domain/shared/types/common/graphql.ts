import { RepositoryUser } from '@prisma/client';
import DataLoader from 'dataloader';
import { CommitResponse, ReleaseInfoEntity } from 'src/domain/modules/repository/types';
import { AuthUser } from 'src/infrastructure/shared/types';

export interface ResolverContext {
  releaseInfoLoader: DataLoader<string, ReleaseInfoEntity[], string>;
  repositoryStatusLoader: DataLoader<[string, string], RepositoryUser, [string, string]>;
  repositoryCommitsLoader?: DataLoader<[string, string], CommitResponse[], [string, string]>;
  user?: AuthUser;
}
