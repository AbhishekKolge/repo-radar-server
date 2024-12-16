import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { PrismaClient } from '@prisma/client';
import { defaultFieldResolver, GraphQLSchema, GraphQLError } from 'graphql';
import { ZodSchema, ZodError } from 'zod';
import * as preferenceSchemas from '../modules/preference/validation';
import * as securitySchemas from '../modules/security/validation';
import * as userSchemas from '../modules/user/validation';
import { UnauthenticatedError } from 'src/infrastructure/error';

type SchemaModule = { [key: string]: ZodSchema };
type AllSchemas = {
  [key: string]: SchemaModule;
};

const allSchemas: AllSchemas = {
  user: userSchemas,
  security: securitySchemas,
  preference: preferenceSchemas,
};

type PrismaModelOperations = 'create' | 'update';

type PrismaInputTypes = {
  User: {
    create: Parameters<PrismaClient['user']['create']>[0]['data'];
    update: Parameters<PrismaClient['user']['update']>[0]['data'];
  };
  Security: {
    create: Parameters<PrismaClient['security']['create']>[0]['data'];
    update: Parameters<PrismaClient['security']['update']>[0]['data'];
  };
  Notification: {
    create: Parameters<PrismaClient['notification']['create']>[0]['data'];
    update: Parameters<PrismaClient['notification']['update']>[0]['data'];
  };
};

type PrismaTypeMap = {
  [K in keyof PrismaInputTypes]?: {
    [O in PrismaModelOperations]?: PrismaInputTypes[K][O];
  };
};

const prismaTypeMap: PrismaTypeMap = {
  User: {
    create: {} as PrismaInputTypes['User']['create'],
    update: {} as PrismaInputTypes['User']['update'],
  },
  Security: {
    create: {} as PrismaInputTypes['Security']['create'],
    update: {} as PrismaInputTypes['Security']['update'],
  },
  Notification: {
    create: {} as PrismaInputTypes['Notification']['create'],
    update: {} as PrismaInputTypes['Notification']['update'],
  },
};

export function authDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth');

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = function (source, args, context, info) {
          if (!context.user) {
            throw new UnauthenticatedError('Authentication invalid');
          }
          return resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}

export function validateDirectiveTransformer(schema: GraphQLSchema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const validateDirective = getDirective(schema, fieldConfig, 'validate');
      const prismaValidateDirective = getDirective(schema, fieldConfig, 'prismaValidate');

      if (validateDirective || prismaValidateDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = function (source, args, context, info) {
          if (validateDirective) {
            const [moduleName, schemaName] = validateDirective[0].schema.split('.');
            const moduleSchemas = allSchemas[moduleName];
            if (!moduleSchemas) {
              throw new GraphQLError(`Module '${moduleName}' not found`, {
                extensions: { code: 'VALIDATION_ERROR' },
              });
            }
            const validationSchema: ZodSchema | undefined = moduleSchemas[schemaName];
            if (!validationSchema) {
              throw new GraphQLError(
                `Validation schema '${schemaName}' not found in module '${moduleName}'`,
                {
                  extensions: { code: 'VALIDATION_ERROR' },
                },
              );
            }
            try {
              validationSchema.parse(args);
            } catch (error) {
              if (error instanceof ZodError) {
                throw error;
              }
            }
          }
          if (prismaValidateDirective) {
            const modelName = prismaValidateDirective[0].model as keyof PrismaInputTypes;
            const operation = prismaValidateDirective[0].operation as PrismaModelOperations;
            const prismaType = prismaTypeMap[modelName]?.[operation];

            if (!prismaType) {
              throw new GraphQLError(
                `Prisma type for model '${modelName}' and operation '${operation}' not found`,
                {
                  extensions: { code: 'VALIDATION_ERROR' },
                },
              );
            }

            function assertPrismaInput<T>(input: unknown): asserts input is T {
              if (typeof input !== 'object' || input === null) {
                throw new GraphQLError('Invalid input: expected an object', {
                  extensions: { code: 'VALIDATION_ERROR' },
                });
              }
            }

            assertPrismaInput<typeof prismaType>(args.input);
          }

          return resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}
