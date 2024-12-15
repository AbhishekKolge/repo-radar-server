// import DataLoader from 'dataloader';
// import { CompanyEntity } from 'src/modules/book/types';

import { AuthUser } from 'src/infrastructure/shared/types';

export interface ResolverContext {
  // companyLoader: DataLoader<string, CompanyEntity, string>;
  user?: AuthUser;
}
