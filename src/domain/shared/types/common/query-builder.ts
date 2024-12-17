import { Prisma } from '@prisma/client';

export interface QueryModel<T> {
  findMany: (args: Prisma.Args<T, 'findMany'>) => Promise<T[]>;
  count: (args: { where?: Prisma.Args<T, 'findMany'>['where'] }) => Promise<number>;
  groupBy: (args: Prisma.Args<T, 'groupBy'>) => Promise<unknown[]>;
}

export interface QueryBuilderOptions<T> {
  model: QueryModel<T>;
  searchFields?: string[];
  sortKey?: string | null;
}

export interface FilterObject {
  search?: string | null;
  [key: string]: unknown;
}

export interface SortOptions {
  [key: string]: Prisma.SortOrder | { sort: Prisma.SortOrder; nulls?: Prisma.NullsOrder };
}
