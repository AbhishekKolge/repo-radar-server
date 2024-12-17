import { ReleaseInfo, RepositoryUser } from '@prisma/client';
import DataLoader from 'dataloader';
import { RepositoryService } from './service';
import { CommitResponse } from './types';

export const createReleaseInfoLoader = () => {
  return new DataLoader<string, ReleaseInfo[]>(
    (repositoryIds: readonly string[]) => {
      const repositoryService = new RepositoryService();
      return repositoryService.getRecentTenReleasesByRepositoryIds(repositoryIds);
    },
    {
      cache: true,
    },
  );
};

export const createRepositoryStatusLoader = () => {
  return new DataLoader<[string, string], RepositoryUser>(
    (keys: readonly [string, string][]) => {
      const repositoryService = new RepositoryService();
      const userIds = keys.map(([_repositoryId, userId]) => userId);
      return repositoryService.getRepositoryStatus(userIds, keys);
    },
    {
      cache: true,
    },
  );
};

export const createRepositoryCommitsLoader = (accessToken: string) => {
  return new DataLoader<[string, string], CommitResponse[]>(
    (keys: readonly [string, string][]) => {
      const repositoryService = new RepositoryService();
      return repositoryService.getRepositoryCommits(accessToken, keys);
    },
    {
      cache: true,
    },
  );
};
