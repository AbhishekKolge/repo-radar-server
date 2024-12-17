import { ReleaseInfo } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RepositoryService } from './service';
import {
  AddUserRepositoryBody,
  GetUserRepositoriesQuery,
  updateUserRepositoryStatusBody,
} from './types';
import { AuthUser } from 'src/infrastructure/shared/types';

export const addUserRepository = (authUser: AuthUser, data: AddUserRepositoryBody) => {
  const repositoryService = new RepositoryService();
  return repositoryService.addOrConnectRepositoryToUser(authUser, data.url);
};

export const getLatestRepositoryRelease = (repositoryId: string): Promise<ReleaseInfo | null> => {
  const repositoryService = new RepositoryService();
  return repositoryService.getLatestRepositoryRelease(repositoryId);
};

export const getUserRepositories = (authUser: AuthUser, query: GetUserRepositoriesQuery) => {
  const repositoryService = new RepositoryService();
  return repositoryService.getUserRepositories(authUser.id, query);
};

export const getUserRepositoryDetails = (authUser: AuthUser, repositoryId: string) => {
  const repositoryService = new RepositoryService();
  return repositoryService.getRepositoryDetailsById(authUser, repositoryId);
};

export const updateUserRepositoryStatus = (
  authUser: AuthUser,
  repositoryId: string,
  data: updateUserRepositoryStatusBody,
) => {
  const repositoryService = new RepositoryService();
  return repositoryService.updateRepositoryStatus(authUser.id, repositoryId, data);
};

export const deleteUserRepository = async (req: Request, res: Response) => {
  const { id: userId } = req.user as AuthUser;
  const { id: repositoryId } = req.params;

  const repositoryService = new RepositoryService();
  await repositoryService.deleteUserRepository(userId, repositoryId);

  res.status(StatusCodes.OK).json({
    message: 'Repository deleted successfully',
  });
};
