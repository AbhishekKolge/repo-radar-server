import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RepositoryService } from './service';
import { AuthUser } from 'src/infrastructure/shared/types';

export const deleteUserRepository = async (req: Request, res: Response) => {
  const { id: userId } = req.user as AuthUser;
  const { id: repositoryId } = req.params;

  const repositoryService = new RepositoryService();
  await repositoryService.deleteUserRepository(userId, repositoryId);

  res.status(StatusCodes.OK).json({
    message: 'Repository deleted successfully',
  });
};
