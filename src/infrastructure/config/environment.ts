import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GRAPHQL_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production', 'staging']).default('development'),
  PORT: z.string().default('8000'),
  APP_NAME: z.string().min(1),
  CLOUD_API_KEY: z.string().min(1),
  CLOUD_API_SECRET: z.string().min(1),
  CLOUD_NAME: z.string().min(1),
  EMAIL_FROM_ID: z.string().min(1),
  EMAIL_FROM_NAME: z.string().min(1),
  FRONT_END_ORIGIN: z.string().url(),
  LOCAL_FRONT_END_ORIGIN: z.string().url(),
  JWT_SECRET: z.string().min(32),
  SENDGRID_API_KEY: z.string().min(1),
  SENDGRID_HOST: z.string().min(1),
  SENDGRID_PORT: z.string().min(1),
  SENDGRID_USER: z.string().min(1),
  TEST_USER_ID: z.string(),
  TOKEN_EXPIRATION_TIME: z.string().min(1),
  ENCRYPT_IV: z.string().min(1),
  ENCRYPT_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);
export const isProduction = (process.env.NODE_ENV === 'production') as boolean;
