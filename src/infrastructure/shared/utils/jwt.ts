import jwt from 'jsonwebtoken';
import { JwtPayload, TokenUser } from '../types';
import { env } from 'src/infrastructure/config';

export const createJWT = ({
  payload,
  expiresIn = env.TOKEN_EXPIRATION_TIME,
}: {
  payload: JwtPayload;
  expiresIn?: string | number;
}): string => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: `${expiresIn}ms`,
  });
  return token;
};

export const isTokenValid = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const getJWTToken = (tokenUser: TokenUser): string => {
  const token = createJWT({ payload: tokenUser });
  return token;
};
