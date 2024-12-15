import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLSchema, GraphQLError } from 'graphql';
import { ZodSchema, ZodError } from 'zod';
import * as userSchemas from '../modules/user/validation';
import { UnauthenticatedError } from 'src/infrastructure/error';

type SchemaModule = { [key: string]: ZodSchema };
type AllSchemas = {
  [key: string]: SchemaModule;
};

const allSchemas: AllSchemas = {
  user: userSchemas,
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

      if (validateDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = function (source, args, context, info) {
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

          return resolve(source, args, context, info);
        };
      }
      return fieldConfig;
    },
  });
}
