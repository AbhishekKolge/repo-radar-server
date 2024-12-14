declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    GRAPHQL_URL: string;
    NODE_ENV: string;
    PORT: string;
    APP_NAME: string;
    CLOUD_API_KEY: string;
    CLOUD_API_SECRET: string;
    CLOUD_NAME: string;
    EMAIL_FROM_ID: string;
    EMAIL_FROM_NAME: string;
    FRONT_END_ORIGIN: string;
    LOCAL_FRONT_END_ORIGIN: string;
    JWT_SECRET: string;
    SENDGRID_API_KEY: string;
    SENDGRID_HOST: string;
    SENDGRID_PORT: string;
    SENDGRID_USER: string;
    TEST_USER_ID: string;
    TOKEN_EXPIRATION_TIME: string;
    ENCRYPT_IV: string;
    ENCRYPT_KEY: string;
  }
}

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      isTestUser: boolean;
    };
  }
}

declare module 'eslint-plugin-import' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const value: DocumentNode;
  export default value;
}
