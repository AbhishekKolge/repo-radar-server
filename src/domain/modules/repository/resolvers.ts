import {
  addUserRepository,
  getLatestRepositoryRelease,
  getUserRepositories,
  getUserRepositoryDetails,
  updateUserRepositoryStatus,
} from './controller';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const repositoryResolvers: Resolvers = {
  Query: {
    repositories: (_root, { query }, { user }) => {
      return getUserRepositories(user as AuthUser, query);
    },
    repository: (_root, { id }, { user }) => {
      return getUserRepositoryDetails(user as AuthUser, id);
    },
  },
  Mutation: {
    addRepository: (_root, { input: details }, { user }) => {
      return addUserRepository(user as AuthUser, details);
    },
    updateRepositoryStatus: (_root, { id: repositoryId, input: details }, { user }) => {
      return updateUserRepositoryStatus(user as AuthUser, repositoryId, details);
    },
  },

  Repository: {
    addedAt: (repository) => {
      return repository.addedAt.toISOString();
    },
    latestRelease: (repository) => {
      return getLatestRepositoryRelease(repository.id);
    },
    archived: (repository, _, { repositoryStatusLoader, user }) => {
      return repositoryStatusLoader.load([repository.id, (user as AuthUser).id]);
    },
    releases: (repository, _, { releaseInfoLoader }) => {
      return releaseInfoLoader.load(repository.id);
    },
    commits: (repository, _, { repositoryCommitsLoader }) => {
      return repositoryCommitsLoader
        ? repositoryCommitsLoader?.load([repository.owner, repository.name])
        : [];
    },
  },
  ReleaseInfo: {
    date: (release) => {
      if (release.date) {
        return release.date.toISOString();
      }
      return null;
    },
  },
};
