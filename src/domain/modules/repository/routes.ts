import express from 'express';
import { deleteUserRepository } from './controller';
import { authenticateUser } from 'src/infrastructure/middleware';

export const repositoryRouter = express.Router();

repositoryRouter.route('/:id').delete(authenticateUser, deleteUserRepository);
