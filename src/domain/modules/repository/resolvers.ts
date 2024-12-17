import { RepositoryService } from './service';
import { Resolvers } from 'src/domain/graphql';
import { AuthUser } from 'src/infrastructure/shared/types';

export const repositoryResolvers: Resolvers = {
  Query: {
    repositories: (_root, { query }, { user }) => {
      const repositoryService = new RepositoryService();
      return repositoryService.getUserRepositories((user as AuthUser).id, query);
    },
    repository: (_root, { id: repositoryId }, { user }) => {
      const repositoryService = new RepositoryService();
      return repositoryService.getRepositoryDetailsById(user as AuthUser, repositoryId);
    },
  },
  Mutation: {
    addRepository: (_root, { input: details }, { user }) => {
      const repositoryService = new RepositoryService();
      return repositoryService.addOrConnectRepositoryToUser(user as AuthUser, details.url);
    },
    updateRepositoryStatus: (_root, { id: repositoryId, input: details }, { user }) => {
      const repositoryService = new RepositoryService();
      return repositoryService.updateRepositoryStatus((user as AuthUser).id, repositoryId, details);
    },
  },

  Repository: {
    addedAt: (repository) => {
      return repository.addedAt.toISOString();
    },
    latestRelease: (repository) => {
      const repositoryService = new RepositoryService();
      return repositoryService.getLatestRepositoryRelease(repository.id);
    },
    archived: async (repository, _, { repositoryStatusLoader, user }) => {
      const status = await repositoryStatusLoader.load([repository.id, (user as AuthUser).id]);
      return status.archived || false;
    },
    viewed: async (repository, _, { repositoryStatusLoader, user }) => {
      const status = await repositoryStatusLoader.load([repository.id, (user as AuthUser).id]);
      return status.viewed || false;
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
