import { env, isProduction } from 'src/infrastructure/config';

export const GITHUB_SCOPE = ['read:user', 'user:email'];
export const GITHUB_FAILURE_REDIRECT = isProduction
  ? `${env.FRONT_END_ORIGIN}/auth/login`
  : `${env.LOCAL_FRONT_END_ORIGIN}/auth/login`;
export const GITHUB_SESSION = false;
