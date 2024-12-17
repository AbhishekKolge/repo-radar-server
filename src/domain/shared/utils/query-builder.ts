import { Prisma } from '@prisma/client';
import { FilterObject, QueryBuilderOptions, QueryModel, SortOptions } from '../types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './default';

export class QueryBuilder<T> {
  private model: QueryModel<T>;
  private query: {
    where: Prisma.Args<T, 'findMany'>['where'];
    orderBy?: SortOptions;
    _avg?: Record<string, boolean>;
    _count?: Record<string, boolean>;
  } = {
    where: {},
  };
  private pagination: { skip?: number; take?: number } = {};
  private searchFields: string[];
  private sortKey: string | null;
  private selectFields: string[] = [];
  private includeRelations: string[] = [];
  private selectIncludes: Record<string, unknown> = {};

  constructor({ model, searchFields = [], sortKey = '' }: QueryBuilderOptions<T>) {
    this.model = model;
    this.searchFields = searchFields;
    this.sortKey = sortKey;
  }

  filter(filterObject: FilterObject): this {
    if (filterObject.search) {
      const searchFilters = this.searchFields.map((field) => ({
        [field]: {
          contains: (filterObject.search as string).trim(),
          mode: 'insensitive' as const,
        },
      }));
      this.query.where = {
        ...this.query.where,
        OR: searchFilters,
      };
      delete filterObject.search;
    }

    this.query.where = {
      ...this.query.where,
      ...filterObject,
    };

    return this;
  }

  filterIn(filterObject: Record<string, unknown>): this {
    for (const key in filterObject) {
      if (Object.hasOwnProperty.call(filterObject, key)) {
        if (filterObject[key]) {
          this.query.where = {
            ...this.query.where,
            [key]: {
              in: (filterObject[key] as string).split(','),
            },
          };
        }
        delete filterObject[key];
      }
    }

    return this;
  }

  filterInNested(filterObject: Record<string, unknown>): this {
    if (filterObject) {
      this.query.where = {
        ...this.query.where,
        ...filterObject,
      };
    }

    return this;
  }

  sort(sortOption?: string | null): this {
    const sortOptions: Record<string, SortOptions> = {
      latest: {
        [this.sortKey as string]: 'desc',
      },
      oldest: {
        [this.sortKey as string]: 'asc',
      },
      highest: {
        [this.sortKey as string]: 'desc',
      },
      lowest: {
        [this.sortKey as string]: 'asc',
      },
      aToZ: {
        [this.sortKey as string]: 'asc',
      },
      zToA: {
        [this.sortKey as string]: 'desc',
      },
    };

    this.query.orderBy = sortOption
      ? sortOptions[sortOption]
      : this.sortKey
        ? {
            [this.sortKey]: 'desc',
          }
        : { createdAt: 'desc' };

    return this;
  }

  sortNested(sortOption: SortOptions): this {
    this.query.orderBy = sortOption;
    return this;
  }

  paginate(pageNumber?: number | null, pageSize?: number | null): this {
    this.pagination = {
      skip: Math.max(0, (pageNumber || DEFAULT_PAGE - 1) * (pageSize || DEFAULT_PAGE_SIZE)),
      take: Math.max(1, pageSize || DEFAULT_PAGE_SIZE),
    };
    return this;
  }

  select(fields: string[]): this {
    this.selectFields = fields;
    return this;
  }

  include(relations: string[]): this {
    this.includeRelations = relations;
    return this;
  }

  selectWithIncludes(nestedFields: Record<string, unknown>): this {
    this.selectIncludes = nestedFields;
    return this;
  }

  private generateSelectObject(): Record<string, boolean> | undefined {
    if (this.selectFields.length) {
      return this.selectFields.reduce(
        (acc, field) => {
          acc[field] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    }
    return undefined;
  }

  private generateIncludeObject(): Record<string, boolean> | undefined {
    if (this.includeRelations.length) {
      return this.includeRelations.reduce(
        (acc, relation) => {
          acc[relation] = true;
          return acc;
        },
        {} as Record<string, boolean>,
      );
    }
    return undefined;
  }

  async execute(): Promise<{
    data: T[];
    totalCount: number;
    totalPages: number;
  }> {
    const { skip, take = DEFAULT_PAGE_SIZE } = this.pagination;

    const select = this.generateSelectObject() || this.selectIncludes;

    const query = {
      where: this.query.where,
      orderBy: this.query.orderBy,
      skip,
      take,
      ...(select ? select : {}),
      include: this.generateIncludeObject(),
    };

    const [data, totalCount] = await Promise.all([
      this.model.findMany(query as Prisma.Args<T, 'findMany'>),
      this.model.count({ where: this.query.where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return { data, totalCount, totalPages };
  }

  avg(selectFields: string[]): this {
    this.query._avg = selectFields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    return this;
  }

  count(selectField: string): this {
    this.query._count = {
      [selectField]: true,
    };

    return this;
  }

  async executeGroupBy(fields: string[]): Promise<unknown[]> {
    const { skip, take = DEFAULT_PAGE_SIZE } = this.pagination;

    const query = {
      by: fields,
      ...this.query,
      skip,
      take,
    } as Prisma.Args<T, 'groupBy'>;

    const result = await this.model.groupBy(query);

    return result;
  }
}
