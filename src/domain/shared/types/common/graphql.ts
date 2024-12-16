import { AuthUser } from 'src/infrastructure/shared/types';
// import DataLoader from 'dataloader';
// import { CompanyEntity } from 'src/modules/book/types';

export interface ResolverContext {
  // companyLoader: DataLoader<string, CompanyEntity, string>;
  user?: AuthUser;
}
