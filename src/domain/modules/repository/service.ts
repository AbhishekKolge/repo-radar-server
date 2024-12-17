import { components } from '@octokit/openapi-types';
import { Prisma, ReleaseInfo, Repository } from '@prisma/client';
import {
  CommitResponse,
  ExtractedRepositoryDetails,
  GetUserRepositoriesQuery,
  GetUserRepositoriesResponse,
  updateUserRepositoryStatusBody,
} from './types';
import { getOwnerType } from './utils';
import { GithubService, OctokitService } from 'src/domain/services';
import { QueryModel } from 'src/domain/shared/types';
import { QueryBuilder } from 'src/domain/shared/utils';
import { prisma } from 'src/infrastructure/database';
import { BadRequestError, ConflictError, NotFoundError } from 'src/infrastructure/error';
import { AuthUser } from 'src/infrastructure/shared/types';
import { formateTimeToIso, GITHUB_DETAILS_EXTRACTOR_REGEX } from 'src/shared/utils';

export class RepositoryService {
  public async addOrConnectRepositoryToUser(authUser: AuthUser, url: string) {
    const { owner, repo } = this.extractOwnerAndRepo(url);
    const existingRepository = await this.getExistingRepository(owner, repo);

    if (existingRepository) {
      const userHasRepository = await this.checkIfUserHasRepositoryById(
        authUser.id,
        existingRepository.id,
      );
      if (userHasRepository) {
        throw new ConflictError('Repository already added');
      }

      return this.addUserToRepository(authUser.id, existingRepository.id);
    }
    const octokitService = new OctokitService(authUser.githubToken);
    const githubService = new GithubService();
    const repositoryDetails = await octokitService.getRepositoryByOwnerAndName(owner, repo);
    const releaseList = await octokitService.getRepositoryReleasesByOwnerAndName(owner, repo);
    const latestRelease = await githubService.getRepositoryLatestRelease(owner, repo);
    const extractedRepositoryFields = this.extractRequiredFieldsFromRepository(repositoryDetails);
    const extractedReleaseList = this.extractRequiredFieldsFromReleases(releaseList);
    if (latestRelease?.notes && extractedReleaseList.length) {
      extractedReleaseList[0].notes = latestRelease.notes;
    }

    return this.createRepository(authUser.id, extractedRepositoryFields, extractedReleaseList);
  }

  public getLatestRepositoryRelease(repositoryId: string): Promise<ReleaseInfo | null> {
    return prisma.releaseInfo.findFirst({
      where: {
        repositoryId,
      },
      orderBy: [
        {
          date: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  public updateRepositoryStatus(
    userId: string,
    repositoryId: string,
    data: updateUserRepositoryStatusBody,
  ): Promise<Repository> {
    return prisma.repository.update({
      where: {
        id: repositoryId,
      },
      data: {
        users: {
          update: {
            where: {
              userId_repositoryId: {
                userId,
                repositoryId,
              },
            },
            data,
          },
        },
      },
    });
  }

  public async deleteUserRepository(userId: string, repositoryId: string): Promise<void> {
    await prisma.repositoryUser.delete({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId,
        },
      },
    });
  }

  public async getRepositoryStatus(
    userIds: readonly string[],
    keys: readonly [string, string][],
  ): Promise<boolean[]> {
    const repositoryStatus = await prisma.repositoryUser.findMany({
      where: {
        userId: {
          in: [...userIds],
        },
        repositoryId: {
          in: keys.map(([repositoryId]) => repositoryId),
        },
      },
    });

    const statusByUserId = repositoryStatus.reduce(
      (acc, repository) => {
        acc[`${repository.repositoryId}:${repository.userId}`] = repository.archived;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return keys.map(
      ([repositoryId, userId]) => statusByUserId[`${repositoryId}:${userId}`] || false,
    );
  }

  public async getRecentTenReleasesByRepositoryIds(
    repositoryIds: readonly string[],
  ): Promise<ReleaseInfo[][]> {
    const releases = await prisma.$queryRaw<ReleaseInfo[]>`
    SELECT *
    FROM (
      SELECT
        r.*,
        ROW_NUMBER() OVER (
          PARTITION BY r."repositoryId"
          ORDER BY r.date DESC, r."createdAt" DESC
        ) AS row_num
      FROM "ReleaseInfo" r
      WHERE r."repositoryId" = ANY(${repositoryIds})
    ) subquery
    WHERE subquery.row_num <= 10;
  `;
    const releasesByRepositoryId: Record<string, ReleaseInfo[]> = {};
    repositoryIds.forEach((id) => {
      releasesByRepositoryId[id] = [];
    });
    releases.forEach((release) => {
      if (!releasesByRepositoryId[release.repositoryId]) {
        releasesByRepositoryId[release.repositoryId] = [];
      }
      releasesByRepositoryId[release.repositoryId].push(release);
    });
    return repositoryIds.map((id) => releasesByRepositoryId[id] || []);
  }

  public async getUserRepositories(
    userId: string,
    query: GetUserRepositoriesQuery,
  ): Promise<GetUserRepositoriesResponse> {
    const queryBuilder = new QueryBuilder<Repository>({
      model: prisma.repository as unknown as QueryModel<Repository>,
      searchFields: ['name', 'owner'],
      sortKey: query?.sortKey,
    });

    const { data, totalCount, totalPages } = await queryBuilder
      .filter({
        search: query?.search,
      })
      .filterInNested({
        users: {
          some: {
            userId,
            archived: query?.archived,
          },
        },
      })
      .sort(query?.sortMethod)
      .paginate(query?.page)
      .execute();

    return { data, totalCount, totalPages };
  }

  public async getRepositoryDetailsById(authUser: AuthUser, id: string) {
    const repository = await prisma.repository.findUnique({
      where: {
        id,
        users: {
          some: {
            userId: authUser.id,
          },
        },
      },
    });
    if (!repository) {
      throw new NotFoundError(`No repository found with id of ${id}`);
    }

    return repository;
  }

  public async getRepositoryCommits(accessToken: string, keys: readonly [string, string][]) {
    const octokitService = new OctokitService(accessToken);

    const repositoryCommits: Record<string, CommitResponse[]> = {};

    for (const [owner, repo] of keys) {
      if (!repositoryCommits[`${owner}:${repo}`]) {
        const commits = await octokitService.getRecentTenRepositoryCommits(owner, repo);
        repositoryCommits[`${owner}:${repo}`] = this.extractRequiredFieldsFromCommits(commits);
      }
    }
    return keys.map(([owner, repo]) => repositoryCommits[`${owner}:${repo}`] || []);
  }

  private createRepository(
    userId: string,
    repositoryDetails: Prisma.RepositoryCreateInput,
    releaseList: Prisma.ReleaseInfoCreateManyRepositoryInput[],
  ): Promise<Repository> {
    return prisma.repository.create({
      data: {
        ...repositoryDetails,
        users: {
          create: {
            userId,
          },
        },
        releases: {
          createMany: {
            data: releaseList,
          },
        },
      },
    });
  }

  private addUserToRepository(userId: string, repositoryId: string): Promise<Repository> {
    return prisma.repository.update({
      where: {
        id: repositoryId,
      },
      data: {
        users: {
          create: {
            userId,
          },
        },
      },
    });
  }

  private async checkIfUserHasRepositoryById(
    userId: string,
    repositoryId: string,
  ): Promise<boolean> {
    const userRepository = await prisma.repositoryUser.findUnique({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId,
        },
      },
    });

    if (userRepository) {
      return true;
    }
    return false;
  }

  private getExistingRepository(owner: string, name: string): Promise<Repository | null> {
    return prisma.repository.findUnique({
      where: {
        name_owner: {
          name,
          owner,
        },
      },
    });
  }

  private extractOwnerAndRepo(url: string): ExtractedRepositoryDetails {
    const match = url.match(GITHUB_DETAILS_EXTRACTOR_REGEX);

    if (match) {
      const owner = match[1];
      const repo = match[2];
      return { owner, repo };
    } else {
      throw new BadRequestError('Invalid Github repository URL');
    }
  }

  private extractRequiredFieldsFromRepository(
    details: components['schemas']['full-repository'],
  ): Prisma.RepositoryUncheckedCreateInput {
    const repository = {
      name: details.name,
      owner: details.owner.login,
      ownerUrl: details.owner.html_url,
      ownerType: getOwnerType(details.owner.type),
      githubUrl: details.html_url,
      description: details.description,
      addedAt: formateTimeToIso(details.created_at),
      httpsCloneUrl: details.clone_url,
      sshCloneUrl: details.ssh_url,
      homepage: details.homepage,
      branch: details.default_branch,
    };

    return repository;
  }

  private extractRequiredFieldsFromReleases(
    list: components['schemas']['release'][],
  ): Prisma.ReleaseInfoCreateManyRepositoryInput[] {
    const releases = list.map((release) => {
      return {
        version: release.tag_name,
        url: release.html_url,
        notes: release.body,
        date: release.published_at ? formateTimeToIso(release.published_at) : undefined,
      };
    });

    return releases;
  }

  private extractRequiredFieldsFromCommits(
    list: components['schemas']['commit'][],
  ): CommitResponse[] {
    const commits = list.map((commit) => {
      return {
        id: commit.node_id,
        url: commit.html_url,
        committer: commit.commit.committer?.name,
        author: commit.commit.author?.name,
        message: commit.commit.message,
        verified: commit.commit.verification?.verified,
      };
    });

    return commits;
  }
}
