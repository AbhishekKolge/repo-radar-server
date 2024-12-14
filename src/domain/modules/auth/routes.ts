import express from 'express';
import { register } from './controllers';

export const authRouter = express.Router();

authRouter.route('/register').post(register);
